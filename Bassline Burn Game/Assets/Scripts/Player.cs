using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    private Radio radio;
    public float base_acceleration = 10f;
    public float base_maxSpeed = 20f;
    public float base_steering = 200f;
    public float base_boostAcceleration = 1.25f;
    public float base_boostMaxSpeed = 1.25f;
    public float base_maxBoostTime = 100f;

    public float acceleration;
    public float maxSpeed;
    public float steering;
    public float boostAcceleration;
    public float boostMaxSpeed;
    public float maxBoostTime;
    public float currentBoostTime = 0;
    private Rigidbody2D rb;

    void Start()
    {
        acceleration = base_acceleration;
        maxSpeed = base_maxSpeed;
        steering = base_steering;
        boostAcceleration = base_boostAcceleration * base_acceleration;
        boostMaxSpeed = base_boostMaxSpeed * base_boostMaxSpeed;
        maxBoostTime = base_maxBoostTime;

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

        // Accelerate the car
        if (moveInput > 0)
        {
            rb.AddForce(transform.up * moveInput * acceleration);
        }
        else if (moveInput < 0)
        {
            rb.AddForce(transform.up * moveInput * acceleration * 0.5f); // reverse speed is slower
        }

        // Limit the car's speed
        rb.velocity = Vector2.ClampMagnitude(rb.velocity, maxSpeed);

        // Steering the car
        float speedFactor = rb.velocity.magnitude / maxSpeed;  // reduces turning at higher speeds
        rb.rotation -= turnInput * steering * speedFactor * Time.deltaTime;

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
        }else if(currentStation == 1){
            steering = base_steering;
            acceleration = base_acceleration*1.1f;
            boostAcceleration =  base_boostAcceleration * base_acceleration * 1.25f;
            boostMaxSpeed = base_boostMaxSpeed * base_boostMaxSpeed *1.1f;
            maxSpeed = base_maxSpeed;
        }
    }
}
