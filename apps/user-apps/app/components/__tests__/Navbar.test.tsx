import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import Navbar from '../Navbar';

describe("Navbar", () => {
    it("Navbar Render Check", () => {
        render(<Navbar/>);
    });
});