using System;
using System.Collections;
using System.Collections.Generic;
using Fusion;
using Fusion.Sockets;
using UnityEngine;
using UnityEngine.InputSystem;

public class KartInput : KartComponent, INetworkRunnerCallbacks
{
	public struct NetworkInputData : INetworkInput
	{
		public const uint ButtonAccelerate = 1 << 0;
		public const uint ButtonReverse = 1 << 1;


		public uint Buttons;
		public uint OneShots;

		private int _steer;
		public float Steer
		{
			get => _steer * .001f;
			set => _steer = (int)(value * 1000);
		}
		
		private int _accelerate;
		public float Accelerate
		{
			get => _accelerate * .001f;
			set => _accelerate = (int)(value * 1000);
		}

		public bool IsUp(uint button) => IsDown(button) == false;
		public bool IsDown(uint button) => (Buttons & button) == button;

		public bool IsDownThisFrame(uint button) => (OneShots & button) == button;
        
	}

	public Gamepad gamepad;

	[SerializeField] private InputAction accelerate;
	[SerializeField] private InputAction steer;
	[SerializeField] private InputAction pause;

	public override void Spawned()
	{
		base.Spawned();

		Runner.AddCallbacks(this);

		accelerate = accelerate.Clone();
		steer = steer.Clone();
		
		pause = pause.Clone();

		accelerate.Enable();
		steer.Enable();
		pause.Enable();
		
		pause.started += PausePressed;
	}

	public override void Despawned(NetworkRunner runner, bool hasState)
	{
        base.Despawned(runner, hasState);
        
		DisposeInputs();
		Runner.RemoveCallbacks(this);
	}

	private void OnDestroy()
	{
		DisposeInputs();
	}

    private void DisposeInputs()
	{
		accelerate.Dispose();
		steer.Dispose();
		
		pause.Dispose();
		// disposal should handle these
		//useItem.started -= UseItemPressed;
		//drift.started -= DriftPressed;
		//pause.started -= PausePressed;
	}


    private void PausePressed(InputAction.CallbackContext ctx)
	{
		if (Kart.Controller.CanDrive) InterfaceManager.Instance.OpenPauseMenu();
	}

	/// This isn't networked, so is not inside the <see cref="NetworkInputData"/> struct

	private static bool ReadBool(InputAction action) => action.ReadValue<float>() != 0;
	private static float ReadFloat(InputAction action) => action.ReadValue<float>();

    public void OnInput(NetworkRunner runner, NetworkInput input) {
        gamepad = Gamepad.current;

        var userInput = new NetworkInputData();

		userInput.Accelerate = ReadFloat(accelerate);

        userInput.Steer = ReadFloat(steer);

        input.Set(userInput);
    }

    public void OnObjectExitAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }
    public void OnObjectEnterAOI(NetworkRunner runner, NetworkObject obj, PlayerRef player) { }
    public void OnPlayerJoined(NetworkRunner runner, PlayerRef player) { }
	public void OnPlayerLeft(NetworkRunner runner, PlayerRef player) { }
	public void OnInputMissing(NetworkRunner runner, PlayerRef player, NetworkInput input) { }
	public void OnShutdown(NetworkRunner runner, ShutdownReason shutdownReason) { }
	public void OnConnectedToServer(NetworkRunner runner) { }
	public void OnDisconnectedFromServer(NetworkRunner runner, NetDisconnectReason reason) { }
	public void OnConnectRequest(NetworkRunner runner, NetworkRunnerCallbackArgs.ConnectRequest request, byte[] token) { }
	public void OnConnectFailed(NetworkRunner runner, NetAddress remoteAddress, NetConnectFailedReason reason) { }
	public void OnUserSimulationMessage(NetworkRunner runner, SimulationMessagePtr message) { }
	public void OnSessionListUpdated(NetworkRunner runner, List<SessionInfo> sessionList) { }
	public void OnCustomAuthenticationResponse(NetworkRunner runner, Dictionary<string, object> data) { }
	public void OnHostMigration(NetworkRunner runner, HostMigrationToken hostMigrationToken) { }
	public void OnReliableDataReceived(NetworkRunner runner, PlayerRef player, ReliableKey key, ArraySegment<byte> data) { }
	public void OnReliableDataProgress(NetworkRunner runner, PlayerRef player, ReliableKey key, float progress) { }
	public void OnSceneLoadDone(NetworkRunner runner) { }
	public void OnSceneLoadStart(NetworkRunner runner) { }
}