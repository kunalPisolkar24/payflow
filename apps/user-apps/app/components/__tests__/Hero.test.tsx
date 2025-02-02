import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import Hero from '../Hero';

describe("Hero Component", () => {
    it("Hero Render Check", () => {
        render(<Hero/>);
    });
});