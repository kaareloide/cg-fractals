// Julia set based on function:
// Z_new = Z_old * Z_old * Z_old + juliaConstant

uniform vec2 center;
uniform float realConstant;
uniform float imaginaryConstant;
uniform float scale;
uniform int maxIterations;

varying vec2 interpolatedUv;

void main() {
    vec3 color = vec3(0.1, 0.1, 0.0);
    float t, absValue;
    vec2 z, c;

    c.x = (interpolatedUv.x - center.x) * scale;
    c.y = (interpolatedUv.y - center.y) * scale;
    z = c;

    for (int i = 0; i < 400; i+= 1) {
        c.x = z.x * z.x * z.x - z.y * z.y * z.x - 2.0 * z.x * z.y * z.y + realConstant;
        c.y = 2.0 * z.x * z.x * z.y + z.x * z.x * z.y - z.y * z.y * z.y + imaginaryConstant;
        absValue = c.x * c.x + c.y * c.y;

        z = c;
        if (i > maxIterations) break;

        if (absValue > 4.0) {
            t = float(i) + 1.0 - log(log2(absValue));
            color.x = mod(t, 0.9);
            color.y = mod(t, 0.5);
            color.z = 0.1;
            break;
        }
    }

    gl_FragColor = vec4(color, 1.0);
}
