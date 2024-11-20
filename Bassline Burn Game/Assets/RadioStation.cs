using System.Collections;
using System.Collections.Generic;
using UnityEngine;

[RequireComponent(typeof(AudioSource))]
public class RadioStation : MonoBehaviour
{
    // public Sprite stationSprite;
    [HideInInspector]
    public AudioSource audioSource;

    public List<AudioClip> stationClips;
    List<AudioClip> currentStationClips;

    public AudioClip currentClip;
    public int currentClipNumber;

    public bool currentRadio;
    public bool stopRadio;

    public float waitTime;
    // Start is called before the first frame update
    void Start()
    {
        audioSource = GetComponent<AudioSource>();
        ShuffleRadio();
    }

    // Update is called once per frame
    void Update()
    {
        transform.rotation = Quaternion.identity;
        if(currentRadio == false && stopRadio == false){
            waitTime -= 1 * Time.deltaTime;
            if(waitTime <= 0){
                audioSource.Stop();
                ShuffleRadio();
                stopRadio = true;
            }
        }

        if(stopRadio != true){
            if(!audioSource.isPlaying){
                currentClipNumber += 1;
                if(currentClipNumber >= currentStationClips.Count){
                    currentClipNumber = 0;
                }

                currentClip = currentStationClips[currentClipNumber];
                audioSource.clip = currentClip;
                audioSource.Play();
            }
        }
    }

    public void ShuffleRadio(){
        currentStationClips = stationClips;
        List<int> numbersTaken = new List<int>();

        for(int i = 0; i < stationClips.Count; i++){
            bool next = false;
            while(next == false){
                int newNumber = Random.Range(0, stationClips.Count);
                if(numbersTaken.Contains(newNumber) == false){
                    currentStationClips[i] = stationClips[newNumber];
                    next = true;
                }
            }
        }
    }
}