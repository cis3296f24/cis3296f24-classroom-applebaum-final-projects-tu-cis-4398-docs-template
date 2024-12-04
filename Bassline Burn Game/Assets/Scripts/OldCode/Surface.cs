using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Surface : MonoBehaviour
{
    public enum SurfaceTypes {Track, Offroad, Hazard};
    
    [Header("Surface")]
    public SurfaceTypes surfaceType;

    void Start()
    {
        
    }

   
}
