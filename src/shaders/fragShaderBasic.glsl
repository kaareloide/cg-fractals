uniform sampler2D tex;
uniform vec2 center;
uniform float scale;
uniform int iterations;

varying vec2 interpolatedUv;

void main() {
    vec2 z, c;

    c.x = 1.3333 * (interpolatedUv.x - 0.5) * scale - center.x;
    c.y = (interpolatedUv.y - 0.5) * scale - center.y;
    
    int j = 0;
    z = c;
    for (int i = 0; i < 10000; i+= 1) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;

        if((x * x + y * y) > 4.0) break;
        z.x = x;
        z.y = y;
        j = i;

        if (i > iterations)
            break;
    }
    float x = (j == iterations ? 0.0 : float(j)) / 100.0;
    vec3 color = texture2D(tex, vec2(x, 0.2)).rgb;
    gl_FragColor = vec4(x, 0.2, 0.2, 1.0);
}