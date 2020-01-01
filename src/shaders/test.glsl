uniform vec2 center;
uniform float scale;

varying vec2 interpolatedUv;

// DE funtion from http://blog.hvidtfeldts.net/index.php/2011/08/distance-estimated-3d-fractals-iii-folding-space/
float DE(vec3 z)
{
    vec3 a1 = vec3(4,4,4);
    vec3 a2 = vec3(-4,-4,4);
    vec3 a3 = vec3(4,-4,-4);
    vec3 a4 = vec3(-4,4,-4);
    vec3 c;
    int n = 0;
    float dist, d;
    for (int n=0; n < 8; n++) {
        c = a1; dist = length(z-a1);
        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
        d = length(z-a3); if (d < dist) { c = a3; dist=d; }
        d = length(z-a4); if (d < dist) { c = a4; dist=d; }
        z = 2.0*z-c*(2.0-1.0);
    }

    return length(z) * pow(2.0, float(-8));
}


// normal calcluation function from http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
vec3 estimateNormal(vec3 p) {
    float EPSILON = 0.1;
    return normalize(vec3(
    DE(vec3(p.x + EPSILON, p.y, p.z)) - DE(vec3(p.x - EPSILON, p.y, p.z)),
    DE(vec3(p.x, p.y + EPSILON, p.z)) - DE(vec3(p.x, p.y - EPSILON, p.z)),
    DE(vec3(p.x, p.y, p.z  + EPSILON)) - DE(vec3(p.x, p.y, p.z - EPSILON))
    ));
}


// code scrapped from different sources
void main() {
    vec2 uv;
    vec3 color = vec3(0.7, 0.1, 0.0);
    int hit = 0;

    uv.x = (interpolatedUv.x - center.x) * scale;
    uv.y = (interpolatedUv.y - center.y) * scale;

    vec3 pos = vec3( 0.0, 0.0, -10.0);
    vec3 dir = normalize( vec3( uv, 1.0 ) );

    vec3 ip; // intermediate point
    //variable step size
    float t = 0.0;
    for( int i = 0; i < 32; i++) {

        //update position along path
        ip = pos + dir * t;

        //gets the shortest distance to the scene
        float temp = DE( ip );

        //break the loop if the distance was too small
        //this means that we are close enough to the surface
        if( temp < 0.1 ) {
            hit = 1;
            break;
        }
        //increment the step along the ray path
        t += temp;
    }

    if (hit == 1) {
        vec3 interpolatedNormal = estimateNormal(ip);
        vec3 v = normalize(pos - ip);
        vec3 lightPosition = vec3(16.0, 4.0, -14.0);
        vec3 l = normalize(lightPosition - ip);
        vec3 r = reflect(-l , ip);

        vec3 halfway = normalize(v+l); //vector for blinn

        float shininess = 60.0;
        color = vec3(0.8, 0.8, 0.4);
        vec3 color = color * 0.1 + color * max(dot(interpolatedNormal, l), 0.0) + pow(max(0.0, dot(halfway, interpolatedNormal)), shininess);



        gl_FragColor = vec4( color, 1.0 );
    } else {
        gl_FragColor = vec4( color, 1.0 );
    }

}