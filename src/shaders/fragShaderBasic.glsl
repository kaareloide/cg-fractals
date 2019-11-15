uniform sampler2D tex;
uniform vec2 center;
uniform float scale;
uniform int maxIterations;

varying vec2 interpolatedUv;

void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    float t, x, y;

    vec2 z, c;

    c.x = (interpolatedUv.x - center.x) * scale;
    c.y = (interpolatedUv.y - center.y) * scale;
    z = c;
    for (int i = 0; i < 10000; i+= 1) {
        x = (z.x * z.x - z.y * z.y) + c.x;
        y = (z.y * z.x + z.x * z.y) + c.y;
        z.x = x;
        z.y = y;

        if((x * x + y * y) > 4.0) {
            t = log(float(i + 1)) / log(float(maxIterations + 1)); // liidetud 1 kuna muidu võib tulla log(0)

            color.x = t * 0.9 + (1.0 - t) * 0.1;
            color.y = t * 0.9 + (1.0 - t) * 0.1;
            color.z = t * 0.1 + (1.0 - t) * 0.9;

            break;
        }


        if (i > maxIterations)
            break;
    }

    gl_FragColor = vec4(color, 1.0);
}