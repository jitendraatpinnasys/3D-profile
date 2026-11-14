import * as THREE from 'three'
import { skillCategories, skills } from '../../data/skills'
import { WORLD } from '../worldLayout'

export const TILE_W = 2.5
export const TILE_H = 0.38
export const TILE_GAP = 0.47
export const TOWER_SPACING = 3.15

export interface TowerLayout {
  categoryIndex: number
  position: THREE.Vector3
  rotationY: number
}

export const towers: TowerLayout[] = skillCategories.map((_, c) => {
  const o = c - (skillCategories.length - 1) / 2
  return {
    categoryIndex: c,
    position: new THREE.Vector3(WORLD.lab.x + o * TOWER_SPACING, 0, WORLD.lab.z + Math.abs(o) * 0.75),
    rotationY: -o * 0.11,
  }
})

/** World position of every skill tile (used for camera focus on selection). */
export const skillWorldPosition: Record<string, THREE.Vector3> = {}
skillCategories.forEach((cat, c) => {
  skills
    .filter((s) => s.category === cat.id)
    .forEach((s, i) => {
      skillWorldPosition[s.id] = towers[c].position.clone().add(new THREE.Vector3(0, -1.05 + i * TILE_GAP, 0))
    })
})
