using System;
using System.Collections;
using System.Collections.Generic;
using Fusion;
using Fusion.Addons.Physics;
using UnityEngine;

public class KartEntity : KartComponent
{
	public static event Action<KartEntity> OnKartSpawned;
	public static event Action<KartEntity> OnKartDespawned;

	public KartController Controller { get; private set; }
	public KartInput Input { get; private set; }
	public KartLapController LapController { get; private set; }
	public KartAudio Audio { get; private set; }
	public GameUI Hud { get; private set; }
	public NetworkRigidbody2D Rigidbody { get; private set; }



    private bool _despawned;
    
    private ChangeDetector _changeDetector;

	private void Awake()
	{
		// Set references before initializing all components
		Controller = GetComponent<KartController>();
		Input = GetComponent<KartInput>();
		LapController = GetComponent<KartLapController>();
		Audio = GetComponentInChildren<KartAudio>();
		Rigidbody = GetComponent<NetworkRigidbody2D>();

		// Initializes all KartComponents on or under the Kart prefab
		var components = GetComponentsInChildren<KartComponent>();
		foreach (var component in components) component.Init(this);
	}

	public static readonly List<KartEntity> Karts = new List<KartEntity>();

	public override void Spawned()
	{
		base.Spawned();
		
		_changeDetector = GetChangeDetector(ChangeDetector.Source.SimulationState);
		
		if (Object.HasInputAuthority)
		{
			// Create HUD
			Hud = Instantiate(ResourceManager.Instance.hudPrefab);
			Hud.Init(this);

		}

		Karts.Add(this);
		OnKartSpawned?.Invoke(this);
	}

	public override void Despawned(NetworkRunner runner, bool hasState)
	{
		base.Despawned(runner, hasState);
		Karts.Remove(this);
		_despawned = true;
		OnKartDespawned?.Invoke(this);
	}

	private void OnDestroy()
	{
		Karts.Remove(this);
		if (!_despawned)
		{
			OnKartDespawned?.Invoke(this);
		}
	}

    private void OnTriggerStay(Collider other) {

		if (other.TryGetComponent(out ICollidable collidable))
        {
            collidable.Collide(this);
        }
    }
}