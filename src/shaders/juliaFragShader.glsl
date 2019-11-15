uniform vec2 center;
uniform float someConstant1;
uniform float someConstant2;
uniform float scale;
uniform int maxIterations;

varying vec2 interpolatedUv;

void main() {
    vec3 color = vec3(0.1, 0.1, 0.8);
    float t;

    vec2 z, c;
    vec2 juliaConstant = vec2(someConstant1, someConstant2);


    c.x = (interpolatedUv.x - center.x) * scale;
    c.y = (interpolatedUv.y - center.y) * scale;
    z = c;
    for (int i = 0; i < 10000; i+= 1) {
        c.x = z.x * z.x - z.y * z.y + juliaConstant.x;
        c.y = 2.0 * z.y * z.x + juliaConstant.y;
        z = c;

        if (c.x * c.x + c.y * c.y > 4.0) {
            // annab arvu vahemikus 0..1
            t = log(float(i + 1)) / log(float(maxIterations + 1)); // liidetud 1 kuna muidu võib tulla log(0)

            color.x = t * 0.7 + (1.0 - t) * 0.1;
            color.y = t * 0.3 + (1.0 - t) * 0.1;
            color.z = t  + (1.0 - t) * 0.1;

            break;
        }

        if (i > maxIterations) break;
    }

    gl_FragColor = vec4(color, 1.0);
}
