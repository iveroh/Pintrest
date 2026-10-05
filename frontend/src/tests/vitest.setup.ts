import '@testing-library/jest-dom/vitest'
import { afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// Mock image imports
vi.mock('../assets/beer-bottle.png', () => ({
  default: 'mocked-beer-bottle.png'
}))

vi.mock('../assets/beer-bottle-empty.png', () => ({
  default: 'mocked-beer-bottle-empty.png'
}))

afterEach(() => {
  cleanup()
})