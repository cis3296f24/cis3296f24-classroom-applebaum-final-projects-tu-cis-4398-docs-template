using System.Collections;
using UnityEngine;
using UnityEngine.UI;
using Random = UnityEngine.Random;

public class GameUI : MonoBehaviour
{
	public interface IGameUIComponent
	{
		void Init(KartEntity entity);
	}
	public Text countdownText;
	public Text timerText;
	public Text lapText;
	

	public EndRaceUI endRaceScreen;
	
	private bool _startedCountdown;

	public KartEntity Kart { get; private set; }
	private KartController KartController => Kart.Controller;
	private KartController localKartController;
	private bool startGame = false;
	private void Awake() {
		
	}

	public IEnumerator Countdown(){
		yield return new WaitForSeconds(1f);
		countdownText.gameObject.SetActive(true);
		countdownText.text = "3";
		yield return new WaitForSeconds(1f);
		countdownText.text = "2";
		yield return new WaitForSeconds(1f);
		countdownText.text = "1";
		yield return new WaitForSeconds(1f);
		countdownText.text = "Go";
		GameManager.Instance.raceStart = true;
		yield return new WaitForSeconds(0.5f);
		countdownText.gameObject.SetActive(false);
		timerText.gameObject.SetActive(true);
		lapText.gameObject.SetActive(true);
	}
	private void Start()
    {
        FindLocalKartController();
		StartCoroutine(Countdown());
    }
	

    private void FindLocalKartController()
    {
        // Find all KartEntities in the scene
        var kartEntities = FindObjectsOfType<KartEntity>();

    foreach (var kart in kartEntities)
    {
        // Check if this KartEntity belongs to the local player
        if (kart.Object.HasInputAuthority) // Use HasInputAuthority for local player detection
        {
            localKartController = kart.Controller;
            Debug.Log("Found local player's KartController!");
            break;
        }
    }

    if (localKartController == null)
    {
        Debug.LogError("Local player's KartController not found!");
    }
    }

	public void Init(KartEntity kart)
	{
		Kart = kart;

		var uis = GetComponentsInChildren<IGameUIComponent>(true);
		foreach (var ui in uis) ui.Init(kart);

		// kart.LapController.OnLapChanged += SetLapCount;

		var track = Track.Current;

		// if (track == null)
		// 	Debug.LogWarning($"You need to initialize the GameUI on a track for track-specific values to be updated!");
		// else
		// {
		// 	introGameModeText.text = GameManager.Instance.GameType.modeName;
		// 	introTrackNameText.text = track.definition.trackName;
		// }

		GameType gameType = GameManager.Instance.GameType;
		

		// if (gameType.IsPracticeMode())
		// {
		// 	timesContainer.SetActive(false);
		// 	lapCountContainer.SetActive(false);
		// }


		// continueEndButton.gameObject.SetActive(kart.Object.HasStateAuthority);

		
	}
	private void Update() {
		int minutes = Mathf.FloorToInt(GameManager.Instance.raceTime / 60); // Calculate minutes
        int seconds = Mathf.FloorToInt(GameManager.Instance.raceTime % 60); // Calculate seconds

        timerText.text = string.Format("{0:00}:{1:00}", minutes, seconds);
		if (localKartController != null)
        {
            lapText.text = localKartController.lapCount.ToString() + "/3";
        }
		
	}

	private void OnDestroy()
	{
		// Kart.LapController.OnLapChanged -= SetLapCount;
	}
	
	public void FinishCountdown()
	{
		Kart.OnRaceStart();
	}

	// public void HideIntro()
	// {
	// 	introAnimator.SetTrigger("Exit");
	// }

	// private void FadeIn()
	// {
	// 	StartCoroutine(FadeInRoutine());
	// }

	// private IEnumerator FadeInRoutine()
	// {
	// 	float t = 1;
	// 	while (t > 0)
	// 	{
	// 		fader.alpha = 1 - t;
	// 		t -= Time.deltaTime;
	// 		yield return null;
	// 	}
	// }

	// private void Update()
	// {	
	// 	if(Kart.LapController)
	// 	if (!Kart || !Kart.LapController.Object || !Kart.LapController.Object.IsValid)

	// 		return;

	// 	if (!_startedCountdown && Track.Current != null && Track.Current.StartRaceTimer.IsRunning)
	// 	{
	// 		var remainingTime = Track.Current.StartRaceTimer.RemainingTime(Kart.Runner);
	// 		if (remainingTime != null && remainingTime <= 3.0f)
	// 		{
	// 			_startedCountdown = true;
	// 			// HideIntro();
	// 			FadeIn();
	// 			countdownAnimator.SetTrigger("StartCountdown");
	// 		}
		
			
	// 	}
		

	// 	if (Kart.LapController.enabled) UpdateLapTimes();
		
	// }

	// private void UpdateLapTimes()
	// {
	// 	if (!Kart.LapController.Object || !Kart.LapController.Object.IsValid)
	// 		return;
	// 	var lapTimes = Kart.LapController.LapTicks;
	// 	for (var i = 0; i < Mathf.Min(lapTimes.Length, lapTimeTexts.Length); i++)
	// 	{
	// 		var lapTicks = lapTimes.Get(i);

	// 		if (lapTicks == 0)
	// 		{
	// 			lapTimeTexts[i].text = "";
	// 		}
	// 		else
	// 		{
	// 			var previousTicks = i == 0
	// 				? Kart.LapController.StartRaceTick
	// 				: lapTimes.Get(i - 1);

	// 			var deltaTicks = lapTicks - previousTicks;
	// 			var time = TickHelper.TickToSeconds(Kart.Runner, deltaTicks);

	// 			SetLapTimeText(time, i);
	// 		}
	// 	}

	// 	SetRaceTimeText(Kart.LapController.GetTotalRaceTime());
	// }

	// private void SetLapCount(int lap, int maxLaps)
	// {
	// 	var text = $"{(lap > maxLaps ? maxLaps : lap)}/{maxLaps}";
	// 	lapCount.text = text;
	// }

	// public void SetRaceTimeText(float time)
	// {
	// 	raceTimeText.text = $"{(int) (time / 60):00}:{time % 60:00.000}";
	// }

	// public void SetLapTimeText(float time, int index)
	// {
	// 	lapTimeTexts[index].text = $"<color=#FFC600>L{index + 1}</color> {(int) (time / 60):00}:{time % 60:00.000}";
	// }

	


	public void ShowEndRaceScreen()
	{
		endRaceScreen.gameObject.SetActive(true);
	}

	// UI Hook

	public void OpenPauseMenu()
	{
		InterfaceManager.Instance.OpenPauseMenu();
	}
}