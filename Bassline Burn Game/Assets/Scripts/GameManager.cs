using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public static GameManager instance;

    public Text timerText;
    public Text countdownText;
    public int countdownTime = 3;

    private float elapsedTime;
    public bool raceOngoing = false;

    private void Awake()
    {
        // Singleton pattern to ensure only one GameManager exists
        if (instance == null)
        {
            instance = this;
            DontDestroyOnLoad(gameObject);
        }
        else
        {
            Destroy(gameObject);
        }
    }

    private void Start()
    {
        StartCoroutine(CountdownToStart());
    }

    private void Update()
    {
        
    }

    IEnumerator CountdownToStart()
    {
        while (countdownTime > 0)
        {
            countdownText.text = countdownTime.ToString();
            yield return new WaitForSeconds(1f);
            countdownTime--;
        }

        countdownText.text = "GO!";
        yield return new WaitForSeconds(1f);
        countdownText.gameObject.SetActive(false);

        StartRace();
    }

    public void StartRace()
    {
        raceOngoing = true;
        elapsedTime = 0f;
        Debug.Log("Race Started!");
    }

    public void EndRace()
    {
        raceOngoing = false;
        Debug.Log("Race Ended! Final Time: " + elapsedTime);

    }

    public void ResetGame()
    {
        // Reset the countdown and timer for a new race
        countdownTime = 3;
        countdownText.gameObject.SetActive(true);
        elapsedTime = 0f;
        raceOngoing = false;
        timerText.text = "00:00";

        StartCoroutine(CountdownToStart());
    }
}
