attribute vec2 uvCoord;
varying vec2 interpolatedUv;

void main() {
    interpolatedUv = uvCoord;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}