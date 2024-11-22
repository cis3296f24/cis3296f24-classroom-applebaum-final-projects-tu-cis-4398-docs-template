using Fusion;
using UnityEngine;

public class Track : NetworkBehaviour
{
	public static Track Current { get; private set; }

	[Networked] public TickTimer StartRaceTimer { get; set; }

	public CameraTrack[] introTracks;
	public Checkpoint[] checkpoints;
	public Transform[] spawnpoints;
	public FinishLine finishLine;

	public TrackDefinition definition;

	public string music = "";
	public float introSpeed = 0.5f;

	private int _currentIntroTrack;
	private float _introIntervalProgress;
	KartInput localCarInputHandler;

	private void Awake()
	{
		Current = this;
	

		GameManager.SetTrack(this);
		GameManager.Instance.camera = Camera.main;
	}

	public override void Spawned()
	{
		base.Spawned();

		if (RoomPlayer.Local.IsLeader)
		{
			
		}

		
	}

	private void OnDestroy()
	{
		GameManager.SetTrack(null);
	}

	public void SpawnPlayer(NetworkRunner runner, RoomPlayer player)
	{
		var index = RoomPlayer.Players.IndexOf(player);
		var point = spawnpoints[index];

		var prefabId = player.KartId;
		var prefab = ResourceManager.Instance.kartDefinitions[prefabId].prefab;

		// Spawn player
		var entity = runner.Spawn(
			prefab,
			point.position,
			point.rotation,
			player.Object.InputAuthority
		);

		

		entity.Controller.RoomUser = player;
		player.GameState = RoomPlayer.EGameState.GameCutscene;
		player.Kart = entity.Controller;
		
		entity.transform.name = $"Kart ({player.Username})";
	}



}