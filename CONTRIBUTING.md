# Contributing to ChronoGlass Calendar

Thank you for your interest in contributing to ChronoGlass Calendar! This document provides guidelines for contributing to the project.

## Code of Conduct

Be respectful, inclusive, and collaborative. We're building this together!

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Device/OS information

### Suggesting Features

1. Check if the feature has been suggested
2. Create a new issue with:
   - Clear description of the feature
   - Use cases and benefits
   - Mockups or examples if applicable

### Pull Requests

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Use TypeScript
   - Add comments for complex logic
   - Maintain DD-MM-YYYY date format
   - Ensure theme compatibility (Material UI 3 & Apple Glass)

4. **Test your changes**
   - Test on both light and dark modes
   - Test on both themes
   - Verify on Android (Expo Go)

5. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
   
   Use conventional commits:
   - `feat:` new feature
   - `fix:` bug fix
   - `docs:` documentation
   - `style:` formatting
   - `refactor:` code restructuring
   - `test:` adding tests
   - `chore:` maintenance

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide clear description
   - Reference related issues
   - Include screenshots for UI changes

## Development Setup

See [README.md](README.md) for installation instructions.

## Code Style

- Use TypeScript for type safety
- Follow existing component patterns
- Use functional components with hooks
- Leverage the theme system (don't hardcode colors)
- Keep components focused and reusable
- Use meaningful variable names

## Project Structure

- `src/components/` - Reusable UI components
- `src/screens/` - App screens
- `src/theme/` - Theme system
- `src/utils/` - Utility functions
- `src/services/` - External service integrations

## Testing

Before submitting a PR:
- [ ] App runs without errors
- [ ] Theme switching works
- [ ] Dark mode works
- [ ] Date format is DD-MM-YYYY everywhere
- [ ] No TypeScript errors
- [ ] Code is formatted consistently

## Questions?

Open an issue or start a discussion!

## License

By contributing, you agree that your contributions will be licensed under the Apache 2.0 License.
