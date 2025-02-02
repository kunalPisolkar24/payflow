import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import Navbar from '../Navbar';

describe("Testimonials Components", () => {
    it("Testimonials Render Check", () => {
        render(<Navbar/>);
    });
});