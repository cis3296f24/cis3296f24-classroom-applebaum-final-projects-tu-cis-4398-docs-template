using UnityEngine;

public class Checkpoint : MonoBehaviour
{
	public int ID { get; set; }

    private void OnTriggerEnter2D(Collider2D other)
    {
        var kart = other.GetComponent<KartController>();
        if (kart != null)
        {
            kart.OnCheckpointCrossed(ID);
        }
    }
}
