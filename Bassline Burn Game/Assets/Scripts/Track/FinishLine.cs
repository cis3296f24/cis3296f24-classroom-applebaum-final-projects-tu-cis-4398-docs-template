using UnityEngine;

public class FinishLine : MonoBehaviour {
    public bool debug;

    private void OnTriggerStay2D(Collider2D other) {
        if ( other.TryGetComponent(out KartLapController kart) ) {
            kart.ProcessFinishLine(this);
        }
    }
}
