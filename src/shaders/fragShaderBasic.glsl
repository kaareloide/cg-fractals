uniform sampler2D tex;
uniform vec2 center;
uniform float scale;

varying vec2 interpolatedUv;

void main() {
    vec2 z, c;
    const int iter = 20;

    c.x = 1.3333 * (interpolatedUv.x - 0.5) * scale - center.x;
    c.y = (interpolatedUv.y - 0.5) * scale - center.y;
    
    int j = 0;
    z = c;
    for (int i = 0; i < iter; i+= 1) {
        float x = (z.x * z.x - z.y * z.y) + c.x;
        float y = (z.y * z.x + z.x * z.y) + c.y;

        if((x * x + y * y) > 4.0) break;
        z.x = x;
        z.y = y;
        j = i;
    }
    float x = (j == iter ? 0.0 : float(j)) / 100.0;
    vec3 color = texture2D(tex, vec2(x, 0.2)).rgb;
    gl_FragColor = vec4(x, 0.2, 0.2, 1.0);
}