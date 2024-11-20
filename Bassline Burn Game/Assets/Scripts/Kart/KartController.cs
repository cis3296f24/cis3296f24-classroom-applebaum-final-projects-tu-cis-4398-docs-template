using System;
using Fusion;
using UnityEngine;

public class KartController : KartComponent
{
	public new CapsuleCollider2D collider;

	public Transform model;

	public float maxSpeedNormal;
	public float maxSpeedBoosting;
	public float reverseSpeed;
	public float acceleration;
	public float deceleration;
	public float driftFactor;

	[Tooltip("X-Axis: steering\nY-Axis: velocity\nCoordinate space is normalized")]


	public float maxSteerStrength = 35;
	public float steerAcceleration;
	public float steerDeceleration;
	public float speedToDrift;

	public Rigidbody2D rb;

	public bool HasFinishedRace => Kart.LapController.EndRaceTick != 0;
	public bool HasStartedRace => Kart.LapController.StartRaceTick != 0;
	private float RealSpeed => transform.InverseTransformDirection(rb.velocity).z;
	public bool IsDrifting => IsDriftingLeft || IsDriftingRight;
	public bool IsOffroad => IsGrounded && GroundResistance >= 0.2f;

	[Networked] public float MaxSpeed { get; set; }
	
	public bool CanDrive = true;

	[Networked]
	public int DriftTierIndex { get; set; } = -1;

	[Networked] public NetworkBool IsGrounded { get; set; }
	[Networked] public float GroundResistance { get; set; }


	[Networked] public RoomPlayer RoomUser { get; set; }
	[Networked] public NetworkBool IsDriftingLeft { get; set; }
	[Networked] public NetworkBool IsDriftingRight { get; set; }



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
	private bool startedTimer = false;
	public float menuTimerMax;
	public float menuTimerCurr;
	public GameObject[] radioUI;
	private void Awake()
	{
		collider = GetComponent<CapsuleCollider2D>();
	}

	public override void Spawned()
	{
		base.Spawned();
		MaxSpeed = maxSpeedNormal;
		radio = GetComponent<Radio>();
	}

	private void Update()
	{
		if(Input.GetKeyDown(KeyCode.Space)){
			if(inRadioMenu == true){
				if(currentStation >= 3){
					currentStation = 0;
				}else{
					currentStation += 1;
				}
				
				radio.NavigateStations(true);
				menuTimerCurr = menuTimerMax;
				startedTimer = true;
				MenuManager(currentStation);
			}else{
				menuTimerCurr = menuTimerMax;
				startedTimer = true;
				radioControlPad.SetActive(true);
				inRadioMenu = true;
			}
			
		}
		if(menuTimerCurr <= 0 && startedTimer){
			radioControlPad.SetActive(false);
			inRadioMenu = false;
			startedTimer = false;
		}
		
		menuTimerCurr -= Time.deltaTime;
	}
	private void MenuManager(int currentStation){
		for(int i = 0; i < 4; i++){
			if(i == currentStation){
				radioUI[i].transform.localScale = new Vector3(0.5f,0.5f,0);
				radioUI[i].GetComponent<Renderer>().material.color = new Color(1.0f, 1.0f, 1.0f, 1f);
			}else{
				radioUI[i].transform.localScale = new Vector3(0.2f,0.2f,0);
				radioUI[i].GetComponent<Renderer>().material.color = new Color(1.0f, 1.0f, 1.0f, 0.5f);
			}
			
		}
	}
	private void OnCollisionStay2D(Collision2D collision)
	{
		// //
		// // OnCollisionEnter and OnCollisionExit are not reliable when trying to predict collisions, however we can
		// // use OnCollisionStay reliably. This means we have to make sure not to run code every frame
		// //

		// var layer = collision.gameObject.layer;

		// // We don't want to run any of this code if we're already in the process of bumping
		

		// if (layer == GameManager.GroundLayer) return;
		// if (layer == GameManager.KartLayer && collision.gameObject.TryGetComponent(out KartEntity otherKart))
		// {
		// 	//
		// 	// Collision with another kart - if we are going slower than them, then we should bump!  
		// 	//

			
		// }
		// else
		// {
		// 	//
		// 	// Collision with a wall of some sort - We should get the angle impact and apply a force backwards, only if 
		// 	// we are going above 'speedToDrift' speed.
		// 	//
		// 	if (RealSpeed > speedToDrift)
		// 	{
		// 		var contact = collision.GetContact(0);
		// 		var dot = Mathf.Max(0.25f, Mathf.Abs(Vector3.Dot(contact.normal, Rigidbody.transform.forward)));
		// 		Rigidbody.AddForceAtPosition(contact.normal * AppliedSpeed * dot, contact.point, ForceMode.VelocityChange);

				
		// 	}
		// }
	}

	public override void FixedUpdateNetwork()
	{
		base.FixedUpdateNetwork();

		

		


		if (CanDrive)
			Move();

		HandleStartRace();
		Drift(Inputs);
		KillOrthagonalVelocity();
		Steer(Inputs);
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

	private void Move()
	{
		moveInput = Input.GetAxis("Vertical");
       
		float velocityVsUp = Vector2.Dot(transform.up, rb.velocity);
        if(velocityVsUp>maxSpeedNormal&& moveInput > 0){
            return;
        }
        if(velocityVsUp<-maxSpeedNormal *0.5f && moveInput < 0){
            return;
        }
        


        if(moveInput == 0){
            rb.drag = Mathf.Lerp(rb.drag, 3.0f, Time.fixedDeltaTime*3);
        }
        else{
            rb.drag = 0;
        }
        Vector2 engineForceVector = transform.up * moveInput * acceleration;
        rb.AddForce(engineForceVector,ForceMode2D.Force);
	}


	private void Steer(KartInput.NetworkInputData input)
	{
		turnInput = Input.GetAxis("Horizontal");
		float minSpeedForTurn = rb.velocity.magnitude/8;
        minSpeedForTurn = Mathf.Clamp01(minSpeedForTurn);
        rotationAngle -= turnInput * maxSteerStrength * speedToDrift;
        rb.MoveRotation(rotationAngle);
	}
	
	void KillOrthagonalVelocity(){
        Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
        Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);

        rb.velocity = forwardVelocity + rightVelocity * driftFactor;
        
    }
	private void Drift(KartInput.NetworkInputData input)
	{
		// var startDrift = input.IsDriftPressedThisFrame && CanDrive && !IsDrifting;
		// if (startDrift && IsGrounded)
		// {
		// 	StartDrifting(input);
		// 	DriftStartTick = Runner.Tick;
		// 	HopTimer = TickTimer.CreateFromSeconds(Runner, 0.367f);
		// }

		// if (IsDrifting)
		// {
		// 	if (!input.IsDriftPressed || RealSpeed < speedToDrift)
		// 	{
		// 		StopDrifting();
		// 	}
		// 	else if (IsGrounded)
		// 	{
		// 		EvaluateDrift(DriftTime, out var index);
		// 		if (DriftTierIndex != index) DriftTierIndex = index;
		// 	}
		// }
	}




	public void ResetState()
	{
		rb.velocity = Vector3.zero;
		AppliedSpeed = 0;
		transform.up = Vector3.up;
		model.transform.up = Vector3.up;
	}

	// type definitions


}