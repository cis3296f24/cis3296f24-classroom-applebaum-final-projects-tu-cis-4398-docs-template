using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CarSurfaceHandler : MonoBehaviour
{
    public LayerMask surfaceLayer;
    Collider2D[] surfaceCollidersHit = new Collider2D[10];
    Vector3 lastSampledSurfacePosition = Vector3.one *10000;
    Surface.SurfaceTypes drivingOnSurface = Surface.SurfaceTypes.Track;
    Collider2D carCollider;
    

    void Awake()
    {
        carCollider = GetComponentInChildren<Collider2D>();
    }
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if((transform.position - lastSampledSurfacePosition).sqrMagnitude < 0.75f){
            return;
        }
        ContactFilter2D contactFilter2D = new ContactFilter2D();
        contactFilter2D.layerMask = surfaceLayer;
        contactFilter2D.useLayerMask = true;
        contactFilter2D.useTriggers = true;

        int numberOfHits = Physics2D.OverlapCollider(carCollider, contactFilter2D, surfaceCollidersHit);

        float lastSurfaceZValue = -1000;

        for (int i = 0; i < numberOfHits;i++){
            Surface surface = surfaceCollidersHit[i].GetComponent<Surface>();
            if(surface.transform.position.z > lastSurfaceZValue){
                drivingOnSurface = surface.surfaceType;
                lastSurfaceZValue = surface.transform.position.z;
            }
        }
        if(numberOfHits == 0){
            drivingOnSurface = Surface.SurfaceTypes.Track;
        }
        lastSampledSurfacePosition = transform.position;
        Debug.Log($"Driving on {drivingOnSurface}");
    }

    public Surface.SurfaceTypes GetCurrentSurface(){
        return drivingOnSurface;
    }
}
