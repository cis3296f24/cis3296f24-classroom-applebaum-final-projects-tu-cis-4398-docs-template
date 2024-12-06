using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.Audio;

public class Radio : MonoBehaviour
{
    public AudioMixer audioMixer;
    public List<RadioStation> radioStations;
    public int currentStation;

    public float waitBeforeOff = 15f;

    // Start is called before the first frame update
    void Start()
    {
        if (radioStations == null || radioStations.Count == 0)
        {
            Debug.LogError("No radio stations assigned. Please add at least one station to the RadioStations list.");
            return;
        }

        // Ensure currentStation is within bounds
        currentStation = Mathf.Clamp(currentStation, 0, radioStations.Count - 1);
        PlayRadio();
    }

    public void AdjustRadioVolume(float value)
    {
        if (audioMixer != null)
        {
            audioMixer.SetFloat("Volume", value);
        }
        else
        {
            Debug.LogWarning("AudioMixer is not assigned.");
        }
    }

    public void PlayRadio()
    {
        if (radioStations == null || radioStations.Count == 0)
        {
            Debug.LogError("No radio stations available to play.");
            return;
        }

        for (int i = 0; i < radioStations.Count; i++)
        {
            if (i != currentStation)
            {
                radioStations[i].waitTime = waitBeforeOff;
                radioStations[i].currentRadio = false;
            }
        }

        radioStations[currentStation].stopRadio = false;
        radioStations[currentStation].currentRadio = true;

        Debug.Log($"Playing station: {currentStation}");
    }

    public void NavigateStations(bool next)
    {
        if (radioStations == null || radioStations.Count == 0)
        {
            Debug.LogError("No radio stations available to navigate.");
            return;
        }

        if (next)
        {
            currentStation++;
            if (currentStation >= radioStations.Count)
            {
                currentStation = 0;
            }
        }
        else
        {
            currentStation--;
            if (currentStation < 0)
            {
                currentStation = radioStations.Count - 1;
            }
        }

        PlayRadio();
    }
}
