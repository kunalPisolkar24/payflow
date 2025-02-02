import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import Navbar from '../Navbar';

describe("Navbar Component", () => {
    it("Navbar Render Check", () => {
        render(<Navbar/>);
    });
});