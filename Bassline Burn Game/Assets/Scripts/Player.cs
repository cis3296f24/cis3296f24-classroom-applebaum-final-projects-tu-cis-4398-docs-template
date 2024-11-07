using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    private Radio radio;
    public float base_acceleration = 5f;
    public float base_maxSpeed = 10f;
    public float base_steering = 3.5f;
    public float base_drift = 0.95f;
    public float base_boostAcceleration = 1.5f;
    public float base_boostMaxSpeed = 1.5f;
    public float base_maxBoostTime = 100f;

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

    void Start()
    {
        acceleration = base_acceleration;
        maxSpeed = base_maxSpeed;
        steering = base_steering;
        boostAcceleration = base_boostAcceleration * base_acceleration;
        boostMaxSpeed = base_boostMaxSpeed * base_boostMaxSpeed;
        maxBoostTime = base_maxBoostTime;
        drift = base_drift;

        rb = GetComponent<Rigidbody2D>();
        radio = GetComponent<Radio>();
        ChangeStats(radio.currentStation);
    }
    

    // Update is called once per frame
    void Update()
    {
        if(Input.GetKeyDown(KeyCode.Q)){
            radio.NavigateStations(true);
            ChangeStats(radio.currentStation);
        }
        if(Input.GetKeyDown(KeyCode.E)){
            radio.NavigateStations(false);
            ChangeStats(radio.currentStation);
        }

        float moveInput = Input.GetAxis("Vertical");
        float turnInput = Input.GetAxis("Horizontal");

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


        // is supposed to create a drag to slow the car down after inputs released
        if(acceleration == 0){
            rb.drag = Mathf.Lerp(rb.drag,3.0f,Time.deltaTime*3);
        }
        else{
            rb.drag = 0;
        }

        // acceleration 
        Vector2 moveVector = transform.up * moveInput * acceleration;
        if (moveInput > 0){
            rb.AddForce(moveVector, ForceMode2D.Force); // forward acceleration
        }
        else if (moveInput < 0){
            rb.AddForce(moveVector*0.5f, ForceMode2D.Force); // reverse acceleration (is slower)
        }
        
        rb.velocity = Vector2.ClampMagnitude(rb.velocity, maxSpeed);   // Limit the car's speed

        // adds an effective drift vector on turns   
        Vector2 forwardVelocity = transform.up * Vector2.Dot(rb.velocity,transform.up);
        Vector2 rightVelocity = transform.right * Vector2.Dot(rb.velocity,transform.right);
        rb.velocity = forwardVelocity + rightVelocity * drift;
        
        /// Moving the car ///



        /// Steering the car ///
        
        float turnSpeedReq = rb.velocity.magnitude/8; // calculates a minimum velocity requirement for turning 
        turnSpeedReq = Mathf.Clamp01(turnSpeedReq); // updates a minimum velocity requirement for turning 
        
        float speedFactor = rb.velocity.magnitude / maxSpeed;  // reduces turning at higher speeds
        //rb.rotation -= turnInput * steering * speedFactor * turnSpeedReq * Time.deltaTime;
        
        someRotation -= turnInput * steering * speedFactor * turnSpeedReq * Time.deltaTime; //calculates rotation angle 
        rb.MoveRotation(someRotation); // applied rotation angle force
        
        /// Steering the car ///
        
        


        // attempt at boost
        if(Input.GetKeyDown(KeyCode.Space) && currentBoostTime >= 0){
            acceleration = boostAcceleration;
            maxSpeed = boostMaxSpeed;
            currentBoostTime -= Time.deltaTime;
        }else{
            acceleration = base_acceleration;
            maxSpeed = base_maxSpeed;
            if(currentBoostTime <= maxBoostTime){
                currentBoostTime += Time.deltaTime;
            }
        }
        // attempt at boost
    }

    public void ChangeStats(int currentStation){
        if(currentStation == 0){
            steering = base_steering*0.75f;
            acceleration = base_acceleration*0.9f;
            boostAcceleration =  base_boostAcceleration * base_acceleration * 1.1f;
            boostMaxSpeed = base_boostMaxSpeed * base_boostMaxSpeed *1.25f;
            maxSpeed = base_maxSpeed * 1.25f;
            drift = base_drift;
        }else if(currentStation == 1){
            steering = base_steering;
            acceleration = base_acceleration*1.1f;
            boostAcceleration =  base_boostAcceleration * base_acceleration * 1.25f;
            boostMaxSpeed = base_boostMaxSpeed * base_boostMaxSpeed *1.1f;
            maxSpeed = base_maxSpeed;
            drift = base_drift * 1.1f;
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

    // float accelerationInput = 0;
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
    //     if(velocityVsUp>someMaxSpeed&& accelerationInput>0){
    //         return;
    //     }
    //     if(velocityVsUp<-someMaxSpeed *0.5f && accelerationInput<0){
    //         return;
    //     }
    //     if(carRigidbody2D.velocity.sqrMagnitude>someMaxSpeed*someMaxSpeed&& acceleration>0){
    //         return;
    //     } 


    //     if(accelerationInput == 0){
    //         carRigidbody2D.drag = Mathf.Lerp(carRigidbody2D.drag,3.0f,Time.fixedDeltaTime*3);
    //     }
    //     else{
    //         carRigidbody2D.drag = 0;
    //     }
    //     Vector2 engineForceVector = transform.up *accelerationInput * accelerationFactor;
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
    //     accelerationInput = inputVector.y;
    // }


/// <>
/// code from https://youtu.be/DVHcOS1E5OQ?list=PLyDa4NP_nvPfmvbC-eqyzdhOXeCyhToko for reference
/// </>
    
}
