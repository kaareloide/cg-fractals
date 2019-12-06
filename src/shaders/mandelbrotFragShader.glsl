// Mandelbrot set based on function:
// Z_new = Z_old * Z_old + initialCoordinates

uniform sampler2D tex;
uniform vec2 center;
uniform float scale;
uniform int maxIterations;
uniform float colorR1;
uniform float colorG1;
uniform float colorB1;

varying vec2 interpolatedUv;

void main() {
    vec3 color = vec3(0.0, 0.0, 0.0);
    float t, x, y;
    vec2 z, c;

    c.x = (interpolatedUv.x - center.x) * scale;
    c.y = (interpolatedUv.y - center.y) * scale;
    z = c;

    for (int i = 0; i < 400; i+= 1) {
        x = (z.x * z.x - z.y * z.y) + c.x;
        y = (z.y * z.x + z.x * z.y) + c.y;
        z.x = x;
        z.y = y;

        if (i > maxIterations)
        break;

        if((x * x + y * y) > 4.0) {
            t = log(float(i + 1)) / log(float(maxIterations + 1)); // liidetud 1 kuna muidu võib tulla log(0)
            color.x = t * colorR1 + (1.0 - t) * 0.8;
            color.y = t * colorG1 + (1.0 - t) * 0.1;
            color.z = t * colorB1 + (1.0 - t) * 0.9;
            break;
        }
    }

    gl_FragColor = vec4(color, 1.0);
}