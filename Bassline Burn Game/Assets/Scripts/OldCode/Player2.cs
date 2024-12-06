using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.UI;

public class Player2 : MonoBehaviour
{
    private Radio radio;
    public float base_acceleration = 5f;
    public float base_maxSpeed = 10f;
    public float base_steering = 3.5f;
    public float base_drift = 0.95f;
    public float base_boostAcceleration;
    public float base_boostMaxSpeed;
    public float base_maxBoostTime;

    private PlayerInput playerInput;
    private InputAction moveAction;
    private InputAction turnAction;
    private InputAction boostAction;
    private InputAction radioNextAction;
    private InputAction radioPrevAction;

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

    void Start()
    {
        

        rb = GetComponent<Rigidbody2D>();
        radio = GetComponent<Radio>();
        
        gm = GameManager2.instance;

        playerInput = GetComponent<PlayerInput>();

        // Map InputActions
        moveAction = playerInput.actions["Move"];
        turnAction = playerInput.actions["Turn"];
        boostAction = playerInput.actions["Boost"];
        radioNextAction = playerInput.actions["RadioNext"];
        radioPrevAction = playerInput.actions["RadioPrev"];

        ChangeStats(radio.currentStation);
    }
    

    // Update is called once per frame
    void Update()
    {
        if(gm.raceOngoing){
            if(radioNextAction.WasPerformedThisFrame()){
                radio.NavigateStations(true);
                
            }
            if(radioPrevAction.WasPerformedThisFrame()){
                radio.NavigateStations(false);
                
            }

            
            moveInput = moveAction.ReadValue<float>();
            turnInput = turnAction.ReadValue<float>();

            elapsedTime += Time.deltaTime;
            int minutes = Mathf.FloorToInt(elapsedTime / 3600);
            int seconds = Mathf.FloorToInt(elapsedTime % 3600);
            timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);
            


            // attempt at boost
            if(boostAction.IsPressed() && currentBoostTime >= 0){
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
        return Vector2.Dot(transform.right, rb.velocity);
    }

    public bool IsTireSchreeching(out float lateralVelocity, out bool isBoosting, out bool isBraking){
        lateralVelocity = GetLateralVelocity();
        isBoosting = false;
        isBraking = false;

        if(moveInput < 0 && velocityVsUp >0){
            isBraking = true;
            return true;
        }


        if (boostAction.IsPressed() && currentBoostTime > 0){
            isBoosting = true;
            return true;
        }


        if(Mathf.Abs(GetLateralVelocity())>4.0f){
            return true;
        }

        return false;
    }

}


// using System;
// using System.Collections;
// using System.Collections.Generic;
// using UnityEngine;
// using UnityEngine.UI;

// public class Player2 : MonoBehaviour
// {
//     private Radio radio;
//     public float base_acceleration = 5f;
//     public float base_maxSpeed = 10f;
//     public float base_steering = 3.5f;
//     public float base_drift = 0.95f;
//     public float base_boostAcceleration;
//     public float base_boostMaxSpeed;
//     public float base_maxBoostTime;

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

//     void Start()
//     {
        

//         rb = GetComponent<Rigidbody2D>();
//         radio = GetComponent<Radio>();
//         ChangeStats(radio.currentStation);
//         gm = GameManager2.instance;
//     }
    

//     // Update is called once per frame
//     void Update()
//     {
//         if(gm.raceOngoing){
//             if(Input.GetKeyDown(KeyCode.Q)){
//                 radio.NavigateStations(true);
                
//             }
//             if(Input.GetKeyDown(KeyCode.E)){
//                 radio.NavigateStations(false);
                
//             }

            
//             moveInput = Input.GetAxis("Vertical2");
//             turnInput = Input.GetAxis("Horizontal2");

//             elapsedTime += Time.deltaTime;
//             int minutes = Mathf.FloorToInt(elapsedTime / 3600);
//             int seconds = Mathf.FloorToInt(elapsedTime % 3600);
//             timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);
            

//             // attempt at boost
//             if(Input.GetKey(KeyCode.X) && currentBoostTime >= 0){
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
// }
