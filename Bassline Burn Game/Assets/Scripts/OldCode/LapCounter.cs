using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LapCounter : MonoBehaviour
{
    int passedCheckPointNumber = 0;
    float timeAtLastPassedCheckPoint = 0;
    int numberOfPasssedCheckPoints = 0;

    int lapsCompleted = 0;
    const int lapsToComplete = 3;
    bool isRaceCompleted = false;
    int carPosition = 0;

    public event Action<LapCounter> OnPassCheckpoint;

    public void SetCarPosition(int position){
        carPosition = position;
    }

    public int GetNumberOfCheckpointsPassed(){
        return numberOfPasssedCheckPoints;
    }

    public float GetTimeAtLastCheckpoint(){
        return timeAtLastPassedCheckPoint;
    }

    void OnTriggerEnter2D(Collider2D collider2D){

        if(isRaceCompleted){
            return;
        }
        // change to CheckPoints if not working
        if(collider2D.CompareTag("CheckPoint")){
            Checkpoints checkpoints = collider2D.GetComponent<Checkpoints>();

            if(passedCheckPointNumber +1 == checkpoints.checkPointNumber){
                passedCheckPointNumber = checkpoints.checkPointNumber;
                numberOfPasssedCheckPoints++;
                timeAtLastPassedCheckPoint = Time.time;

                if(checkpoints.isFinishLine){
                    passedCheckPointNumber = 0;
                    lapsCompleted++;
                    if(lapsCompleted >= lapsToComplete){
                        isRaceCompleted = true;
                    }
                }

                OnPassCheckpoint?.Invoke(this);
            }
        }

    }
}
