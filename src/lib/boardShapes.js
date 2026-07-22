import * as THREE from "three";
import { Box, Circle, Cylinder, Cone, Torus, Diamond } from "lucide-react";

export const BOARD_COLORS = [
  "#4a9eff",
  "#d6409a",
  "#5fb47a",
  "#e88a2a",
  "#7f77dd",
  "#3a95ac",
  "#4db8e8",
  "#e0402a",
];

export const BOARD_SHAPES = [
  {
    id: "cube",
    label: "Cube",
    icon: Box,
    makeGeometry: () => new THREE.BoxGeometry(1.1, 1.1, 1.1),
    restY: 0.55,
  },
  {
    id: "sphere",
    label: "Sphere",
    icon: Circle,
    makeGeometry: () => new THREE.SphereGeometry(0.7, 32, 24),
    restY: 0.7,
  },
  {
    id: "cylinder",
    label: "Cylinder",
    icon: Cylinder,
    makeGeometry: () => new THREE.CylinderGeometry(0.6, 0.6, 1.2, 32),
    restY: 0.6,
  },
  {
    id: "cone",
    label: "Cone",
    icon: Cone,
    makeGeometry: () => new THREE.ConeGeometry(0.7, 1.3, 32),
    restY: 0.65,
  },
  {
    id: "torus",
    label: "Torus",
    icon: Torus,
    makeGeometry: () => new THREE.TorusGeometry(0.55, 0.22, 16, 48),
    restY: 0.77,
  },
  {
    id: "diamond",
    label: "Diamond",
    icon: Diamond,
    makeGeometry: () => new THREE.OctahedronGeometry(0.8),
    restY: 0.8,
  },
];

export function getShape(id) {
  return BOARD_SHAPES.find((shape) => shape.id === id) || BOARD_SHAPES[0];
}
