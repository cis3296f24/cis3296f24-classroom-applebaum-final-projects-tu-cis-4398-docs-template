using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Player : MonoBehaviour
{
    private Radio radio;
    public float acceleration = 10f;
    public float maxSpeed = 20f;
    public float steering = 200f;

    private Rigidbody2D rb;

    void Start()
    {
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
    }

    public void ChangeStats(int currentStation){
        if(currentStation == 0){
            steering = 150f;
            maxSpeed = 7f;
        }else if(currentStation == 1){
            steering = 200f;
            maxSpeed = 3f;
        }
    }
}
