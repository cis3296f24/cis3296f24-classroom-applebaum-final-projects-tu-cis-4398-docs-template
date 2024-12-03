using System;
using Fusion;
using UnityEngine;
using System.Collections.Generic;
using System.Collections;


public class KartController : KartComponent
{
	public new CapsuleCollider2D collider;

	public Transform model;

	public float maxSpeedNormal;
	public float acceleration;
	public float driftFactor;

	[Tooltip("X-Axis: steering\nY-Axis: velocity\nCoordinate space is normalized")]


	public float maxSteerStrength = 35;
	public float speedToDrift;

	public Rigidbody2D rb;
	public int lapCount { get; private set; } = 1;

	public bool HasFinishedRace => Kart.LapController.EndRaceTick != 0;
	public bool HasStartedRace => Kart.LapController.StartRaceTick != 0;
	private float RealSpeed => transform.InverseTransformDirection(rb.velocity).z;

	[Networked] public float MaxSpeed { get; set; }

	[Networked] public RoomPlayer RoomUser { get; set; }

	[Networked] public float AppliedSpeed { get; set; }

	[Networked] private KartInput.NetworkInputData Inputs { get; set; }


	[Networked] private float SteerAmount { get; set; }
	[Networked] private int AcceleratePressedTick { get; set; }
	[Networked] private bool IsAccelerateThisFrame { get; set; }

	private Radio radio;
	public GameObject radioControlPad;
	public GameObject finishScreen;
	private bool inRadioMenu;
	public float rotationAngle = 0;
	private int currentStation = 0;

	public float moveInput;
    public float turnInput;
	public float menuTimerMax;
	public float menuTimerCurr;
	public GameObject[] radioUI;
	[Networked] private Vector2 Position { get; set; }
	[Networked] private float Rotation { get; set; }

	private HashSet<int> checkpointsPassed = new HashSet<int>();
	private int totalCheckpoints = 6;
	private int highestCheckpointPassed = 0;
	private bool finished { get; set; } = false;

	[Networked] public bool IsRaceFinished { get; private set; } = false;


	private void Awake()
	{
		collider = GetComponent<CapsuleCollider2D>();
		
	}

	public override void Spawned()
	{
		base.Spawned();
		radio = GetComponent<Radio>();
		if (Object.HasInputAuthority)
        {
            
        }


	}

	private void Update(){
		// if (Inputs.IsDownThisFrame(KartInput.NetworkInputData.ButtonRadio))
		// {
		// 	if (inRadioMenu)
		// 	{
		// 		currentStation = (currentStation + 1) % radioUI.Length;
		// 		radio.NavigateStations(true);
		// 		menuTimerCurr = menuTimerMax;
		// 		startedTimer = true;
		// 		MenuManager(currentStation);
		// 	}
		// 	else
		// 	{
		// 		menuTimerCurr = menuTimerMax;
		// 		startedTimer = true;
		// 		radioControlPad.SetActive(true);
		// 		inRadioMenu = true;
		// 	}
		// }

		// if (menuTimerCurr <= 0 && startedTimer)
		// {
		// 	radioControlPad.SetActive(false);
		// 	inRadioMenu = false;
		// 	startedTimer = false;
		// }

		// menuTimerCurr -= Time.deltaTime;
	}


	private void MenuManager(int currentStation){
		// for(int i = 0; i < 4; i++){
		// 	if(i == currentStation){
		// 		radioUI[i].transform.localScale = new Vector3(0.5f,0.5f,0);
		// 		radioUI[i].GetComponent<Renderer>().material.color = new Color(1.0f, 1.0f, 1.0f, 1f);
		// 	}else{
		// 		radioUI[i].transform.localScale = new Vector3(0.2f,0.2f,0);
		// 		radioUI[i].GetComponent<Renderer>().material.color = new Color(1.0f, 1.0f, 1.0f, 0.5f);
		// 	}
			
		// }
	}

	
    public override void FixedUpdateNetwork()
	{
		base.FixedUpdateNetwork();

		if (IsRaceFinished)
		{
			rb.velocity = Vector2.zero; // Ensure the car remains stopped
			return; // Prevent further updates
		}

		if (GetInput(out KartInput.NetworkInputData input))
		{
			Inputs = input;
		}

		if (GameManager.Instance.raceStart)
		{
			Move(Inputs);
			Steer(Inputs);

			if (Object.HasStateAuthority)
			{
				Position = rb.position;
				Rotation = rb.rotation;
			}
			else
			{
				rb.position = Vector2.Lerp(rb.position, Position, Time.deltaTime * 10);
				rb.rotation = Mathf.LerpAngle(rb.rotation, Rotation, Time.deltaTime * 10);
			}
		}

		HandleStartRace();
		KillOrthagonalVelocity();
	}


    private void HandleStartRace()
    {
        if (!HasStartedRace && Track.Current != null && Track.Current.StartRaceTimer.Expired(Runner))
        {
            var components = GetComponentsInChildren<KartComponent>();
            foreach (var component in components) component.OnRaceStart();
        }
    }

    public override void OnRaceStart()
    {
        base.OnRaceStart();
		
		
        if (Object.HasInputAuthority)
        {
            AudioManager.PlayMusic(Track.Current.music);
        }
    }

    private void Move(KartInput.NetworkInputData input)
{
    if (finished)
    {
        rb.velocity = Vector2.zero;
        return; // Do nothing if the race is finished
    }

    moveInput = input.Accelerate;

    float velocityVsUp = Vector2.Dot(transform.up, rb.velocity);

    if (Object.HasStateAuthority)
    {
        if (velocityVsUp > maxSpeedNormal && moveInput > 0)
            moveInput = 0;
        if (velocityVsUp < -maxSpeedNormal * 0.5f && moveInput < 0)
            moveInput = 0;

        if (moveInput != 0)
        {
            Vector2 engineForce = transform.up * moveInput * acceleration;
            rb.AddForce(engineForce, ForceMode2D.Force);
        }
        else
        {
            // Apply drag when there's no input
            ApplyDrag();
        }

        Position = rb.position;
    }
}


	private void ApplyDrag()
	{
		float dragCoefficient = 0.3f; // Adjust this value for stronger or weaker drag
		Vector2 velocity = rb.velocity;

		// Apply a force opposite to the velocity to simulate drag
		Vector2 dragForce = -velocity.normalized * velocity.sqrMagnitude * dragCoefficient;

		// Add drag force to the Rigidbody2D
		rb.AddForce(dragForce, ForceMode2D.Force);
	}

	private void Steer(KartInput.NetworkInputData input)
{
    if (finished)
    {
        return; // Prevent steering if the race is finished
    }

    turnInput = input.Steer;

    if (Object.HasStateAuthority)
    {
        float steerAmount = turnInput * maxSteerStrength;
        rotationAngle -= steerAmount * speedToDrift;
        rb.MoveRotation(rotationAngle);

        Rotation = rb.rotation; // Sync rotation
    }
}



	void KillOrthagonalVelocity(){
        Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
        Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);

        rb.velocity = forwardVelocity + rightVelocity * driftFactor;
        
    }

	public void ResetState()
	{
		rb.velocity = Vector3.zero;
		AppliedSpeed = 0;
		transform.up = Vector3.up;
		model.transform.up = Vector3.up;
	}
	public void OnTriggerEnter2D(Collider2D other) {
		if(other.gameObject.name == "Finish"){
			if(HasInputAuthority)
			{
				if (CheckpointsComplete())
				{
					if (lapCount >= 3) // Adjust maxLaps based on your TrackDefinition
					{
						lapCount++;
						CompleteRace();
					}
					else
					{
						lapCount++;
						ResetCheckpoints(); // Reset for the next lap
					}
				}
			}else{
				// finished = true;
			}
		}
	}

	public bool CheckpointsComplete()
{
    return checkpointsPassed.Count == totalCheckpoints;
}


	public void CompleteRace()
	{
		if (!IsRaceFinished)
		{
			IsRaceFinished = true; // Mark race as finished for this player
			rb.velocity = Vector2.zero; // Stop the car
			rb.angularVelocity = 0; // Stop any rotation
		}
	}



	public void SetTotalCheckpoints(int count)
	{
		totalCheckpoints = count;
	}

	public void OnCheckpointCrossed(int checkpointID)
	{
		// Ensure this is for the local player's kart
		if (!Object.HasInputAuthority) return;

		if (!checkpointsPassed.Contains(checkpointID))
		{
			checkpointsPassed.Add(checkpointID);
			if (checkpointID > highestCheckpointPassed)
			{
				highestCheckpointPassed = checkpointID;
			}

			if (CheckpointsComplete())
			{
				Debug.Log($" now finish the lap!");
			}
		}
	}

	public void ResetCheckpoints()
	{
		checkpointsPassed.Clear();
		highestCheckpointPassed = 0;
		Debug.Log($"Checkpoints reset for lap {lapCount + 1}.");
	}

	private void StopCar()
{
    // Stop the Rigidbody2D
    rb.velocity = Vector2.zero;
    rb.angularVelocity = 0;

    // Prevent any input from affecting the car
    moveInput = 0;
    turnInput = 0;

    Debug.Log("Race finished. Car stopped.");
}


}