using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraController : MonoBehaviour
{
    //For Cameras 2 and 3:
    public Rigidbody2D target;

    //For Camera 1
    //public Ship target;

    public float distanceMultiplier = 3;

    public float responsiveness = 0.1f;

    public float maxOffset = 5;

    Vector3 currentOffset;

    void LateUpdate()
    {
        Vector3 targetPosition = target.transform.position;

        targetPosition.z = transform.position.z;

        //Camera 1 - input based look ahead
        //Vector3 targetOffset = transform.up * target.Thrust

        //Camera 2 - Velocity based camera - comment out this line for other versions
        // Vector3 targetOffset = target.velocity * distanceMultiplier;

        //Camera 3 - Forward Velocity Only
        float forwardSpeed = Vector3.Dot(target.velocity, target.transform.up);
        Vector3 targetOffset = target.transform.up * forwardSpeed * distanceMultiplier;

        Debug.DrawRay(targetPosition, targetOffset);

        targetOffset = Vector3.ClampMagnitude(targetOffset, maxOffset);

        currentOffset = Vector3.Lerp(currentOffset, targetOffset, responsiveness * Time.deltaTime);

        targetPosition += currentOffset;

        transform.position = targetPosition;
    }
}
