import { describe, it} from 'vitest';
import { render } from '@testing-library/react';
import FAQ from '../FAQSection';

describe("FAQ Component", () => {
    it("FAQ Render Check", () => {
        render(<FAQ/>);
    });
});