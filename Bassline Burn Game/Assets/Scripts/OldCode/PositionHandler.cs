using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

public class PositionHandler : MonoBehaviour
{
    public List<LapCounter> lapCounters = new List<LapCounter>();
    void Start()
    {
        LapCounter[] lapCountersArray = FindObjectsOfType<LapCounter>();
        lapCounters = lapCountersArray.ToList<LapCounter>();

        foreach(LapCounter somelapCounters in lapCounters){
            somelapCounters.OnPassCheckpoint += OnPassCheckpoint;
        }
    }

    void OnPassCheckpoint(LapCounter lapCounter){
        //Debug.Log($"Event: Car {lapCounter.gameObject.name} passed a checkpoint");
        lapCounters = lapCounters.OrderByDescending(s => s.GetNumberOfCheckpointsPassed()).ThenBy(s=>s.GetTimeAtLastCheckpoint()).ToList();

        int carPosition = lapCounters.IndexOf(lapCounter)+1;

        lapCounter.SetCarPosition(carPosition);
    }

    
}
