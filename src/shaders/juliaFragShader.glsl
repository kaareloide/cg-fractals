uniform vec2 center;
uniform float realConstant;
uniform float imaginaryConstant;
uniform float scale;
uniform int maxIterations;
uniform int functionExponent;

varying vec2 interpolatedUv;

void main() {
    vec3 color = vec3(0.1, 0.1, 0.0);
    float t, absValue;

    vec2 z, c;
    vec2 juliaConstant = vec2(realConstant, imaginaryConstant);


    c.x = (interpolatedUv.x - center.x) * scale;
    c.y = (interpolatedUv.y - center.y) * scale;
    z = c;
    for (int i = 0; i < 10000; i+= 1) {

        // Z_new = Z * Z + juliaConstant
        if (functionExponent == 0) {
            c.x = z.x * z.x - z.y * z.y + juliaConstant.x;
            c.y = 2.0 * z.y * z.x + juliaConstant.y;

            absValue = c.x * c.x + c.y * c.y;
            if (absValue > 4.0) {
                // annab arvu vahemikus 0..1
                t = log(float(i + 1)) / log(float(maxIterations + 1));// liidetud 1 kuna muidu võib tulla log(0)

                color.x = t * 0.7 + (1.0 - t) * 0.1;
                color.y = t * 0.3 + (1.0 - t) * 0.1;
                color.z = t  + (1.0 - t) * 0.1;
                break;
            }
        }

        // Z_new = Z * Z * Z + juliaConstant
        else if (functionExponent == 1) {
            c.x = z.x * z.x * z.x - z.y * z.y * z.x - 2.0 * z.x * z.y * z.y + juliaConstant.x;
            c.y = 2.0 * z.x * z.x * z.y + z.x * z.x * z.y - z.y * z.y * z.y + juliaConstant.y;

            absValue = c.x * c.x + c.y * c.y;
            if (absValue > 4.0) {
                t = float(i) + 1.0 - log(log2(absValue));

                color.x = mod(t, 1.0);
                color.y = mod(t, 1.0);
                color.z = mod(t, 1.0);

                break;
            }
        }

        z = c;

        if (i > maxIterations) break;
    }

    gl_FragColor = vec4(color, 1.0);
}
