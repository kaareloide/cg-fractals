uniform vec2 center;
uniform float scale;
uniform float dTime;

varying vec2 interpolatedUv;

#define STEP_LIMIT 32
#define EPSILON 0.008
vec3 color = vec3(0.3, 0.05, 0.0);

// rotation funtion from http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
mat4 rotateY(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat4(
    vec4(c, 0, s, 0),
    vec4(0, 1, 0, 0),
    vec4(-s, 0, c, 0),
    vec4(0, 0, 0, 1)
    );
}

mat4 rotateX(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat4(
    vec4(1, 0, 0, 0),
    vec4(0, c, -s, 0),
    vec4(0, s, c, 0),
    vec4(0, 0, 0, 1)
    );
}

mat4 rotateZ(float theta) {
    float c = cos(theta);
    float s = sin(theta);

    return mat4(
    vec4(c, -s, 0, 0),
    vec4(s, c, 0, 0),
    vec4(0, 0, 1, 0),
    vec4(0, 0, 0, 1)
    );
}



// DE funtion from http://blog.hvidtfeldts.net/index.php/2011/08/distance-estimated-3d-fractals-iii-folding-space/
float DE(vec3 z){
    z = (rotateY(dTime) * vec4(z, 1.0)).xyz;
    z = (rotateX(0.0) * vec4(z, 1.0)).xyz;
    z = (rotateZ(0.0) * vec4(z, 1.0)).xyz;

    vec3 a1 = vec3(4,4,4);
    vec3 a2 = vec3(-4,-4,4);
    vec3 a3 = vec3(4,-4,-4);
    vec3 a4 = vec3(-4,4,-4);
    vec3 c;
    int n = 0;
    float dist, d;
    for (int n=0; n < 11; n++) {
        c = a1; dist = length(z-a1);
        d = length(z-a2); if (d < dist) { c = a2; dist=d; }
        d = length(z-a3); if (d < dist) { c = a3; dist=d; }
        d = length(z-a4); if (d < dist) { c = a4; dist=d; }
        z = 2.0*z-c*(2.0-1.0);
    }

    return length(z) * pow(2.0, float(-11));
}

// normal calcluation function from http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
    DE(vec3(p.x + EPSILON, p.y, p.z)) - DE(vec3(p.x - EPSILON, p.y, p.z)),
    DE(vec3(p.x, p.y + EPSILON, p.z)) - DE(vec3(p.x, p.y - EPSILON, p.z)),
    DE(vec3(p.x, p.y, p.z  + EPSILON)) - DE(vec3(p.x, p.y, p.z - EPSILON))
    ));
}


// code scrapped from different sources
void main() {
    int hit = 0;
    vec2 uv;
    uv.x = (interpolatedUv.x - center.x) * scale;
    uv.y = (interpolatedUv.y - center.y) * scale;

    vec3 pos = vec3( 0.0, 0.0, -10.0);
    vec3 dir = normalize( vec3( uv, 1.0 ) );

    vec3 ip; // intermediate point

    float t = 0.0;
    for( int i = 0; i < STEP_LIMIT; i++) {

        //update position along path
        ip = pos + dir * t;

        //the shortest distance to the scene
        float temp = DE( ip );

        //break the loop if the distance was too small
        //this means that we are close enough to the surface
        if( temp < EPSILON ) {
            hit = 1;
            break;
        }
        //increment the step along the ray path
        t += temp;
    }

    // phong lightning
    if (hit == 1) {
        vec3 interpolatedNormal = estimateNormal(ip);
        vec3 v = normalize(pos - ip);
        vec3 lightPosition = vec3(36.0, 4.0, -14.0);
        vec3 l = normalize(lightPosition - ip);
        vec3 r = reflect(-l , ip);
        vec3 halfway = normalize(v+l);
        float shininess = 26.0;
        color = vec3(0.9, 0.9, 0.4);
        color = color * 0.2 + color * max(dot(interpolatedNormal, l), 0.0) + pow(max(0.0, dot(halfway, interpolatedNormal)), shininess);

    }

    gl_FragColor = vec4( color, 1.0 );
}