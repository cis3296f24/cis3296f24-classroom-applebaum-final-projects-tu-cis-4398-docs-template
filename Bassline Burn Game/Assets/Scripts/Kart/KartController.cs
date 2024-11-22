using System;
using Fusion;
using UnityEngine;

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
	public int lapCount { get; private set; } = 0;

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
	public bool CanDrive = false;

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

		if (GetInput(out KartInput.NetworkInputData input))
		{
			
			Inputs = input;
		}
		if(GameManager.Instance.raceStart){
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
		CanDrive = true;
		
        if (Object.HasInputAuthority)
        {
            AudioManager.PlayMusic(Track.Current.music);
        }
    }

    private void Move(KartInput.NetworkInputData input)
	{
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
			if (HasInputAuthority)
			{
				lapCount++;
			}
		}
	}
}