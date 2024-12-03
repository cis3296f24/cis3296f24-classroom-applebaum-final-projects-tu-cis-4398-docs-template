using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using UnityEngine.InputSystem;


public class Player : MonoBehaviour
{
    private Radio radio;
    public float base_acceleration = 5f;
    public float base_maxSpeed = 10f;
    public float base_steering = 3.5f;
    public float base_drift = 0.95f;
    public float base_boostAcceleration;
    public float base_boostMaxSpeed;
    public float base_maxBoostTime;

    // funny new variables
    public float someDirection = 0;
    public float someRotation = 0;

    


    public float acceleration;
    public float maxSpeed;
    public float steering;
    public float boostAcceleration;
    public float boostMaxSpeed;
    public float maxBoostTime;
    public float currentBoostTime = 0;
    public float drift;
    private Rigidbody2D rb;
    public float moveInput;
    public float turnInput;
    public float rotationAngle = 0;

    public float someMaxSpeed = 0;
    public float velocityVsUp = 0;


    public float turnFactor = 3.5f;
    public float driftFactor = 0.95f;

    private GameManager2 gm;
    public Text timerText;
    public Text lapsText;
    public Text finishedText;
    private float elapsedTime;
    public int lapsCompleted = 1;
    private bool passedCheckpoint = false;
    public float boostMultiplier;

    bool isJumping = false;

    //UnityEngine.Vector2 someWASD = UnityEngine.Vector2.zero;
    
    //public PlayerInputActions playerControls;

    [Header("Inputs")]
    public InputAction playerMovement;
    public InputAction playerRadioNext;
    public InputAction playerRadioPrev;
    public InputAction playerBoost;

    public InputAction playerJump;

    [Header("Sprites")]
    public SpriteRenderer carSpriteRenderer;
    public SpriteRenderer carShadowRenderer;

    [Header("Jumping")]
    public AnimationCurve jumpCurve;


    void OnEnable(){
        playerMovement.Enable();
        playerRadioNext.Enable();
        playerRadioPrev.Enable();
        playerBoost.Enable();
        playerJump.Enable();
    }

    void OnDisable(){
        playerMovement.Disable();
        playerRadioNext.Disable();
        playerRadioPrev.Disable();
        playerBoost.Disable();
        playerJump.Disable();
    }


    void Start()
    {
        

        rb = GetComponent<Rigidbody2D>();
        radio = GetComponent<Radio>();
        ChangeStats(radio.currentStation);
        gm = GameManager2.instance;
    }
    

    // Update is called once per frame
    void Update()
    {
        if(gm.raceOngoing){
            if(playerRadioNext.WasPressedThisFrame()){
                radio.NavigateStations(true);
                
            }
            if(playerRadioPrev.WasPressedThisFrame()){
                radio.NavigateStations(false);
                
            }


            Vector2 someWASD = playerMovement.ReadValue<Vector2>();

            moveInput = someWASD.y;
            turnInput = someWASD.x;
            // moveInput = Input.GetAxis("Vertical");
            // turnInput = Input.GetAxis("Horizontal");

            elapsedTime += Time.deltaTime;
            int minutes = Mathf.FloorToInt(elapsedTime / 3600);
            int seconds = Mathf.FloorToInt(elapsedTime % 3600);
            timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);


            // attempt at boost
            if(playerBoost.IsPressed() && currentBoostTime >= 0){
                boostMultiplier = 3f;
                someMaxSpeed = 15f;
                currentBoostTime -= Time.deltaTime * 2f;
            }else{
                boostMultiplier = 1f;
                someMaxSpeed = 10f;
                if(currentBoostTime < maxBoostTime){
                    currentBoostTime += Time.deltaTime;
                }
                ChangeStats(radio.currentStation);
            }


            if(playerJump.IsPressed()){
                Jump(1.0f,0.0f);
            }
        }
        // attempt at boost

        lapsText.text = "Laps: " + lapsCompleted + " / 3";
    }

    void FixedUpdate(){
        if(gm.raceOngoing){
            ApplyEngineForce();
            KillOrthagonalVelocity();
            ApplySteeringForce();
        }
    }

    void ApplyEngineForce(){

        velocityVsUp = Vector2.Dot(transform.up, rb.velocity);
        if(velocityVsUp>someMaxSpeed&& moveInput>0){
            return;
        }
        if(velocityVsUp<-someMaxSpeed *0.5f && moveInput<0){
            return;
        }
        if(rb.velocity.sqrMagnitude>someMaxSpeed*someMaxSpeed&& acceleration>0){
            return;
        } 


        if(moveInput == 0){
            rb.drag = Mathf.Lerp(rb.drag,3.0f,Time.fixedDeltaTime*3);
        }
        else{
            rb.drag = 0;
        }
        Vector2 engineForceVector = transform.up *moveInput * base_acceleration * boostMultiplier;
        rb.AddForce(engineForceVector,ForceMode2D.Force);
    }

    void ApplySteeringForce(){
        float minSpeedForTurn = rb.velocity.magnitude/8;
        minSpeedForTurn = Mathf.Clamp01(minSpeedForTurn);
        rotationAngle -= turnInput * turnFactor * minSpeedForTurn;
        rb.MoveRotation(rotationAngle);
    }

    void KillOrthagonalVelocity(){
        Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
        Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);

        rb.velocity = forwardVelocity + rightVelocity * driftFactor;
        
    }

    public void ChangeStats(int currentStation){
        if(currentStation == 0){
            base_acceleration = 6f;
            someMaxSpeed = 10f;
            driftFactor = 0.97f;
            
        }else if(currentStation == 1){
            base_acceleration = 5f;
            someMaxSpeed = 5f;
            driftFactor = 0.94f;
        }
    }

    void OnTriggerEnter2D(Collider2D col)
    {
        if (col.gameObject.name.ToLower().Contains("checkpoint"))
        {
            passedCheckpoint = true;
            Debug.Log("Hit " + col.gameObject.name);
        }
        else if (col.gameObject.name == "Finish" && passedCheckpoint)
        {
            if(lapsCompleted <3){
                lapsCompleted++;
                passedCheckpoint = false;
                Debug.Log("Hit " + col.gameObject.name);
            }else{
                finishedText.enabled = true;
                finishedText.text = "You Are Winnar!";
                Time.timeScale = 0f;
                
        
            }
            
        }
        
        
    }

    float GetLateralVelocity(){
        return UnityEngine.Vector2.Dot(transform.right, rb.velocity);
    }

    public bool IsTireSchreeching(out float lateralVelocity, out bool isBoosting, out bool isBraking){
        lateralVelocity = GetLateralVelocity();
        isBoosting = false;
        isBraking = false;

        if(moveInput < 0 && velocityVsUp >0){
            isBraking = true;
            return true;
        }


        if (playerBoost.IsPressed() && currentBoostTime > 0){
            isBoosting = true;
            return true;
        }


        if(Mathf.Abs(GetLateralVelocity())>4.0f){
            return true;
        }

        return false;
    }

    public void Jump(float jumpHeightScale, float jumpPushScale){
        if(!isJumping){
            StartCoroutine(JumpCo(jumpHeightScale, jumpPushScale));
        }
    }
    private IEnumerator JumpCo(float jumpHeightScale, float jumpPushScale){
        isJumping = true;
        float jumpStartTime = Time.time;
        float jumpDuration = 2;
        while(isJumping){
            float jumpCompletedPercentage = (Time.time - jumpStartTime) / jumpDuration;
            jumpCompletedPercentage = Mathf.Clamp01(jumpCompletedPercentage);

            
            carSpriteRenderer.transform.localScale = Vector3.one * jumpCurve.Evaluate(jumpCompletedPercentage) * jumpHeightScale;
            carShadowRenderer.transform.localScale = carSpriteRenderer.transform.localScale * 0.75f;
            carShadowRenderer.transform.localPosition = new Vector3(1,-1,0.0f)*3*jumpCurve.Evaluate(jumpCompletedPercentage)*jumpHeightScale;


            if(jumpCompletedPercentage == 1.0f){
                break;
            }

            yield return null;
        }
        carSpriteRenderer.transform.localScale = Vector3.one;
        
        carShadowRenderer.transform.localPosition = Vector3.zero;

        carShadowRenderer.transform.localScale = carSpriteRenderer.transform.localScale;

        isJumping = false;
    }
}




// using System;
// using System.Collections;
// using System.Collections.Generic;
// using UnityEngine;
// using UnityEngine.InputSystem;
// using UnityEngine.UI;

// public class Player : MonoBehaviour
// {
//     private Radio radio;
//     public float base_acceleration = 5f;
//     public float base_maxSpeed = 10f;
//     public float base_steering = 3.5f;
//     public float base_drift = 0.95f;
//     public float base_boostAcceleration;
//     public float base_boostMaxSpeed;
//     public float base_maxBoostTime;

//     private PlayerInput playerInput;

//     private PlayerInputActions inputActions; 
//     private InputAction moveAction;
//     private InputAction turnAction;
//     private InputAction boostAction;
//     private InputAction radioNextAction;
//     private InputAction radioPrevAction;

//     // funny new variables
//     public float someDirection = 0;
//     public float someRotation = 0;

    


//     public float acceleration;
//     public float maxSpeed;
//     public float steering;
//     public float boostAcceleration;
//     public float boostMaxSpeed;
//     public float maxBoostTime;
//     public float currentBoostTime = 0;
//     public float drift;
//     private Rigidbody2D rb;
//     public float moveInput;
//     public float turnInput;
//     public float rotationAngle = 0;

//     public float someMaxSpeed = 0;
//     public float velocityVsUp = 0;


//     public float turnFactor = 3.5f;
//     public float driftFactor = 0.95f;

//     private GameManager2 gm;
//     public Text timerText;
//     public Text lapsText;
//     public Text finishedText;
//     private float elapsedTime;
//     public int lapsCompleted = 1;
//     private bool passedCheckpoint = false;
//     public float boostMultiplier;

//     void Awake()
//     {
//         inputActions = new PlayerInputActions();
//     }

//     void OnEnable()
//     {
//         inputActions.Player.Enable();
//     }

//     void OnDisable()
//     {
//         inputActions.Player.Disable();
//     }
//     void Start()
//     {
        

//         rb = GetComponent<Rigidbody2D>();
//         radio = GetComponent<Radio>();
        
//         gm = GameManager2.instance;

//         playerInput = GetComponent<PlayerInput>();

//         // Map InputActions
//         moveAction = inputActions.Player.Move;
//         turnAction = inputActions.Player.Turn;
//         boostAction = inputActions.Player.Boost;
//         radioNextAction = inputActions.Player.RadioNext;
//         radioPrevAction = inputActions.Player.RadioPrev;

//         ChangeStats(radio.currentStation);
//     }
    

//     // Update is called once per frame
//     void Update()
//     {
//         if(gm.raceOngoing){
//             if(radioNextAction.WasPerformedThisFrame()){
//                 radio.NavigateStations(true);
                
//             }
//             if(radioPrevAction.WasPerformedThisFrame()){
//                 radio.NavigateStations(false);
                
//             }

            
//             moveInput = moveAction.ReadValue<float>();
//             turnInput = turnAction.ReadValue<float>();

//             elapsedTime += Time.deltaTime;
//             int minutes = Mathf.FloorToInt(elapsedTime / 3600);
//             int seconds = Mathf.FloorToInt(elapsedTime % 3600);
//             timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);
            


//             // attempt at boost
//             if(boostAction.IsPressed() && currentBoostTime >= 0){
//                 boostMultiplier = 3f;
//                 someMaxSpeed = 15f;
//                 currentBoostTime -= Time.deltaTime * 2f;
//             }else{
//                 boostMultiplier = 1f;
//                 someMaxSpeed = 10f;
//                 if(currentBoostTime < maxBoostTime){
//                     currentBoostTime += Time.deltaTime;
//                 }
//                 ChangeStats(radio.currentStation);
//             }
//         }
//         // attempt at boost

//         lapsText.text = "Laps: " + lapsCompleted + " / 3";
//     }

//     void FixedUpdate(){
//         if(gm.raceOngoing){
//             ApplyEngineForce();
//             KillOrthagonalVelocity();
//             ApplySteeringForce();
//         }
//     }

//     void ApplyEngineForce(){

//         velocityVsUp = Vector2.Dot(transform.up, rb.velocity);
//         if(velocityVsUp>someMaxSpeed&& moveInput>0){
//             return;
//         }
//         if(velocityVsUp<-someMaxSpeed *0.5f && moveInput<0){
//             return;
//         }
//         if(rb.velocity.sqrMagnitude>someMaxSpeed*someMaxSpeed&& acceleration>0){
//             return;
//         } 


//         if(moveInput == 0){
//             rb.drag = Mathf.Lerp(rb.drag,3.0f,Time.fixedDeltaTime*3);
//         }
//         else{
//             rb.drag = 0;
//         }
//         Vector2 engineForceVector = transform.up *moveInput * base_acceleration * boostMultiplier;
//         rb.AddForce(engineForceVector,ForceMode2D.Force);
//     }

//     void ApplySteeringForce(){
//         float minSpeedForTurn = rb.velocity.magnitude/8;
//         minSpeedForTurn = Mathf.Clamp01(minSpeedForTurn);
//         rotationAngle -= turnInput * turnFactor * minSpeedForTurn;
//         rb.MoveRotation(rotationAngle);
//     }

//     void KillOrthagonalVelocity(){
//         Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
//         Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);

//         rb.velocity = forwardVelocity + rightVelocity * driftFactor;
        
//     }

//     public void ChangeStats(int currentStation){
//         if(currentStation == 0){
//             base_acceleration = 6f;
//             someMaxSpeed = 10f;
//             driftFactor = 0.97f;
            
//         }else if(currentStation == 1){
//             base_acceleration = 5f;
//             someMaxSpeed = 5f;
//             driftFactor = 0.94f;
//         }
//     }

//     void OnTriggerEnter2D(Collider2D col)
//     {
//         if (col.gameObject.name.ToLower().Contains("checkpoint"))
//         {
//             passedCheckpoint = true;
//             Debug.Log("Hit " + col.gameObject.name);
//         }
//         else if (col.gameObject.name == "Finish" && passedCheckpoint)
//         {
//             if(lapsCompleted <3){
//                 lapsCompleted++;
//                 passedCheckpoint = false;
//                 Debug.Log("Hit " + col.gameObject.name);
//             }else{
//                 finishedText.enabled = true;
//                 finishedText.text = "You Are Winnar!";
//                 Time.timeScale = 0f;
                
        
//             }
            
//         }
        
        
//     }

//     float GetLateralVelocity(){
//         return Vector2.Dot(transform.right, rb.velocity);
//     }

//     public bool IsTireSchreeching(out float lateralVelocity, out bool isBoosting, out bool isBraking){
//         lateralVelocity = GetLateralVelocity();
//         isBoosting = false;
//         isBraking = false;

//         if(moveInput < 0 && velocityVsUp >0){
//             isBraking = true;
//             return true;
//         }


//         if (boostAction.IsPressed() && currentBoostTime > 0){
//             isBoosting = true;
//             return true;
//         }


//         if(Mathf.Abs(GetLateralVelocity())>4.0f){
//             return true;
//         }

//         return false;
//     }

// }
