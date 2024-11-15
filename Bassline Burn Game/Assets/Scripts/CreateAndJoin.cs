using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using Photon.Pun;
using Photon.Realtime;
using TMPro;
using Photon.Pun.Demo.Cockpit;
using System;

public class CreateAndJoin : MonoBehaviourPunCallbacks
{
    public TMP_InputField input_create;
    public TMP_InputField input_join;

    public void CreateRoom(){
        PhotonNetwork.CreateRoom(input_create.text, new RoomOptions() {MaxPlayers= 4, IsVisible = true, IsOpen = true}, TypedLobby.Default, null);
    }

    public void JoinRoom(){
        PhotonNetwork.JoinRoom(input_join.text);
    }

    public void JoinRooInList(String RoomName){
        PhotonNetwork.JoinRoom(RoomName);
    }

    public override void OnJoinedRoom(){
        print(PhotonNetwork.CountOfPlayersInRooms);
        PhotonNetwork.LoadLevel("Multi");
    }
    
}
