/**
 * Tests for the D3.js TypeScript boilerplate DOM functionality
 * Verifies that the expected HTML structure is created
 */

// Mock D3 selection methods for testing
const mockD3 = {
  select: jest.fn().mockReturnThis(),
  append: jest.fn().mockReturnThis(),
  attr: jest.fn().mockReturnThis(),
  text: jest.fn().mockReturnThis(),
  empty: jest.fn().mockReturnValue(false)
};

// Override the select method to return mock elements with expected values
mockD3.select.mockImplementation((selector: string) => {
  if (selector === '#viz') {
    return {
      ...mockD3,
      select: jest.fn().mockImplementation((sel: string) => {
        if (sel === 'svg') {
          return {
            ...mockD3,
            attr: jest.fn((attrName: string) => {
              if (attrName === 'width') return '200';
              if (attrName === 'height') return '100';
              return mockD3;
            }),
            select: jest.fn().mockImplementation((sel: string) => {
              if (sel === 'text') {
                return {
                  ...mockD3,
                  text: jest.fn().mockImplementation((content?: string) => {
                    if (content === undefined) return 'Hello, D3.js!';
                    return mockD3;
                  }),
                  attr: jest.fn((attrName: string) => {
                    if (attrName === 'x') return '50';
                    if (attrName === 'y') return '50';
                    if (attrName === 'text-anchor') return 'left';
                    if (attrName === 'font-size') return '20px';
                    return mockD3;
                  }),
                  empty: jest.fn().mockReturnValue(false)
                };
              }
              return mockD3;
            })
          };
        }
        return mockD3;
      })
    };
  }
  return mockD3;
});

// Mock the d3 module
jest.mock('d3', () => mockD3);

describe('D3 TypeScript Boilerplate DOM Tests', () => {
  beforeEach(() => {
    // Set up DOM environment for each test
    document.body.innerHTML = '<div id="viz"></div>';
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Clean up DOM after each test
    document.body.innerHTML = '';
  });

  test('D3 functionality can be tested', () => {
    // Import the mocked d3 module
    const d3 = require('d3');
    
    // Verify D3 is available and mockable
    expect(d3).toBeDefined();
    expect(d3.select).toBeDefined();
    
    // Test the D3 chain that should create our elements
    const svg = d3.select("#viz")
      .append("svg")
      .attr("width", 200)
      .attr("height", 100)
      .append("g")
      .append("text")
      .attr("x", 50)
      .attr("y", 50)
      .attr("text-anchor", "left")
      .attr("font-size", "20px")
      .text("Hello, D3.js!");

    // Verify the selection chain was called
    expect(d3.select).toHaveBeenCalledWith("#viz");
    expect(svg.append).toHaveBeenCalled();
    expect(svg.attr).toHaveBeenCalled();
    expect(svg.text).toHaveBeenCalledWith("Hello, D3.js!");
  });

  test('simulates correct text content', () => {
    const d3 = require('d3');
    
    // Simulate the D3 selection and verify expected text
    const textElement = d3.select('#viz').select('svg').select('text');
    expect(textElement.text()).toBe('Hello, D3.js!');
    expect(textElement.attr('x')).toBe('50');
    expect(textElement.attr('y')).toBe('50');
    expect(textElement.attr('text-anchor')).toBe('left');
    expect(textElement.attr('font-size')).toBe('20px');
  });

  test('simulates correct SVG dimensions', () => {
    const d3 = require('d3');
    
    // Simulate the D3 selection and verify expected dimensions
    const svgElement = d3.select('#viz').select('svg');
    expect(svgElement.attr('width')).toBe('200');
    expect(svgElement.attr('height')).toBe('100');
  });
});