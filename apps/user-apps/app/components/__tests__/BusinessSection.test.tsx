import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import BusinessSection from '../BusinessSection';

describe("Business Section Component", () => {
    it("Business SEction Render Check", () => {
        render(<BusinessSection/>);
    });
});