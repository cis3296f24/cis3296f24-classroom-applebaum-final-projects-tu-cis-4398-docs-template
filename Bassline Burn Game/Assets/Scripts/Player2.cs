using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
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

    private GameManager gm;
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
        ChangeStats(radio.currentStation);
        gm = GameManager.instance;
    }
    

    // Update is called once per frame
    void Update()
    {
        if(gm.raceOngoing){
            if(Input.GetKeyDown(KeyCode.Q)){
                radio.NavigateStations(true);
                
            }
            if(Input.GetKeyDown(KeyCode.E)){
                radio.NavigateStations(false);
                
            }

            
            moveInput = Input.GetAxis("Vertical");
            turnInput = Input.GetAxis("Horizontal");

            elapsedTime += Time.deltaTime;
            int minutes = Mathf.FloorToInt(elapsedTime / 3600);
            int seconds = Mathf.FloorToInt(elapsedTime % 3600);
            timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);

            /// Moving the car ///
            
            // according to the tutorial this is useful for potential future mechanics but breaks our code
            // someDirection = Vector2.Dot(transform.up, rb.velocity);
            // if(someDirection>maxSpeed&& moveInput>0){
            //     return;
            // }
            // if(someDirection<-maxSpeed *0.5f && moveInput<0){
            //     return;
            // }
            // if(rb.velocity.sqrMagnitude>maxSpeed*maxSpeed&& acceleration>0){
            //     return;
            // } 




            // // is supposed to create a drag to slow the car down after inputs released
            // if(acceleration == 0){
            //     rb.drag = Mathf.Lerp(rb.drag,3.0f,Time.deltaTime*3);
            // }
            // else{
            //     rb.drag = 0;
            // }

            // // acceleration 
            // Vector2 moveVector = transform.up * moveInput * acceleration;
            // if (moveInput > 0){
            //     rb.AddForce(moveVector, ForceMode2D.Force); // forward acceleration
            // }
            // else if (moveInput < 0){
            //     rb.AddForce(moveVector*0.5f, ForceMode2D.Force); // reverse acceleration (is slower)
            // }
            
            // rb.velocity = Vector2.ClampMagnitude(rb.velocity, maxSpeed);   // Limit the car's speed

            // // adds an effective drift vector on turns   
            // Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
            // Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);
            // rb.velocity = forwardVelocity + rightVelocity * drift;
            
            // /// Moving the car ///



            // /// Steering the car ///
            
            // float turnSpeedReq = rb.velocity.magnitude/8; // calculates a minimum velocity requirement for turning 
            // turnSpeedReq = Mathf.Clamp01(turnSpeedReq); // updates a minimum velocity requirement for turning 
            
            // float speedFactor = rb.velocity.magnitude / maxSpeed;  // reduces turning at higher speeds
            // //rb.rotation -= turnInput * steering * speedFactor * turnSpeedReq * Time.deltaTime;
            
            // someRotation -= turnInput * steering * speedFactor * turnSpeedReq * Time.deltaTime; //calculates rotation angle 
            // rb.MoveRotation(someRotation); // applied rotation angle force
            
            // /// Steering the car ///
            
            


            // attempt at boost
            if(Input.GetKey(KeyCode.Space) && currentBoostTime >= 0){
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
/// <>
/// code from https://youtu.be/DVHcOS1E5OQ?list=PLyDa4NP_nvPfmvbC-eqyzdhOXeCyhToko for reference
/// </>

    // [Header("Car settings")]
    // public float accelerationFactor = 30.0f;
    // public float someMaxSpeed = 0;
    // public float velocityVsUp = 0;


    // public float turnFactor = 3.5f;
    // public float driftFactor = 0.95f;

    // float moveInput = 0;
    // float steeringInput = 0;

    // float rotationAngle = 0;

    // Rigidbody2D carRigidbody2D;

    // void Awake(){
    //     carRigidbody2D = GetComponent<Rigidbody2D>();
    // }

    // void Start(){

    // }

    // void Update(){

    // }
    // void FixedUpdate(){
    //     ApplyEngineForce();
    //     KillOrthagonalVelocity();
    //     ApplySteeringForce();
    // }

    // void ApplyEngineForce(){

    //     velocityVsUp = Vector2.Dot(transform.up, carRigidbody2D.velocity);
    //     if(velocityVsUp>someMaxSpeed&& moveInput>0){
    //         return;
    //     }
    //     if(velocityVsUp<-someMaxSpeed *0.5f && moveInput<0){
    //         return;
    //     }
    //     if(carRigidbody2D.velocity.sqrMagnitude>someMaxSpeed*someMaxSpeed&& acceleration>0){
    //         return;
    //     } 


    //     if(moveInput == 0){
    //         carRigidbody2D.drag = Mathf.Lerp(carRigidbody2D.drag,3.0f,Time.fixedDeltaTime*3);
    //     }
    //     else{
    //         carRigidbody2D.drag = 0;
    //     }
    //     Vector2 engineForceVector = transform.up *moveInput * accelerationFactor;
    //     carRigidbody2D.AddForce(engineForceVector,ForceMode2D.Force);
    // }

    // void ApplySteeringForce(){
    //     float minSpeedForTurn = carRigidbody2D.velocity.magnitude/8;
    //     minSpeedForTurn = Mathf.Clamp01(minSpeedForTurn);
    //     rotationAngle -= steeringInput * turnFactor * minSpeedForTurn;
    //     carRigidbody2D.MoveRotation(rotationAngle);
    // }

    // void KillOrthagonalVelocity(){
    //     Vector2 forwardVelocity = transform.up * Vector2.Dot(carRigidbody2D.velocity,transform.up);
    //     Vector2 rightVelocity = transform.right * Vector2.Dot(carRigidbody2D.velocity,transform.right);

    //     carRigidbody2D.velocity = forwardVelocity + rightVelocity * driftFactor;
        
    // }

    // public void SetInputVector(Vector2 inputVector){
    //     steeringInput = inputVector.x;
    //     moveInput = inputVector.y;
    // }


/// <>
/// code from https://youtu.be/DVHcOS1E5OQ?list=PLyDa4NP_nvPfmvbC-eqyzdhOXeCyhToko for reference
/// </>
    
}
