# Platform Rules Management System

## Overview

The Platform Rules Management System is a comprehensive feature that allows super admins to manage and enforce content rules specific to each social media platform. The system automatically validates AI-generated and user-created content against platform-specific constraints and provides real-time feedback.

## Features

### 1. **Platform-Specific Rules Database**
- Stores comprehensive rules for each major social media platform
- Supports text constraints (character limits, hashtag counts)
- Supports media constraints (aspect ratios, file sizes, video lengths)
- Supports posting limits (daily post recommendations)
- All rules based on 2025 platform specifications

### 2. **Supported Platforms**
- **Instagram**: Caption limits, hashtag counts, image/video aspect ratios, Reels specifications
- **TikTok**: Video requirements, caption limits, aspect ratio constraints
- **LinkedIn**: Post length limits, professional hashtag recommendations
- **Twitter/X**: Character limits (standard & premium), media specifications
- **Facebook**: Extensive character limits, engagement-optimized recommendations
- **Pinterest**: Pin descriptions, image aspect ratios, video specifications

### 3. **Real-Time Content Validation**
- Validates content against platform rules before posting
- Provides immediate feedback on violations and warnings
- Distinguishes between hard violations and best-practice warnings
- Shows current vs. maximum/recommended values

### 4. **Admin Management Interface**
- Super admin-only access to rule management
- Edit rule values via JSON configuration
- Toggle rules on/off without deleting them
- Update rule descriptions and metadata
- Filter rules by platform
- Visual platform-specific color coding

### 5. **Persona Integration**
- Automatically filters rules based on persona-selected platforms
- Only shows relevant platform constraints to users
- Seamless integration with existing persona workflow

## Architecture

### Database Schema

```sql
CREATE TABLE platform_rules (
  id UUID PRIMARY KEY,
  platform TEXT NOT NULL,
  rule_type TEXT NOT NULL, -- 'text', 'media', 'posting'
  rule_name TEXT NOT NULL,
  rule_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  is_customizable BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(platform, rule_type, rule_name)
);
```

### TypeScript Interfaces

```typescript
interface PlatformRule {
  id: string;
  platform: string;
  rule_type: 'text' | 'media' | 'posting';
  rule_name: string;
  rule_value: Record<string, any>;
  description: string | null;
  is_active: boolean;
  is_customizable: boolean;
  created_at: string;
  updated_at: string;
}

interface RuleValidationResult {
  isValid: boolean;
  violations: RuleViolation[];
  warnings: RuleWarning[];
}
```

## Usage

### For Users

1. **View Platform Rules**
   - Navigate to System Management > Platform Rules (super admin only)
   - Rules are automatically filtered based on your personas' selected platforms
   - View all constraints for each platform organized by type

2. **Content Validation** (Coming soon in Content Scheduling)
   - Validation happens automatically when creating/editing posts
   - Real-time warnings appear if content exceeds platform limits
   - Color-coded alerts:
     - 🔴 Red = Violation (content won't meet platform requirements)
     - 🟡 Yellow = Warning (content will work but may not perform optimally)
     - 🟢 Green = All good!

### For Super Admins

1. **Managing Rules**
   - Access via Dashboard > System Management > Platform Rules
   - Click "Edit" button on any rule to modify it
   - Update the JSON value, description, or active status
   - Save changes to apply immediately

2. **Rule Value Format**
   ```json
   // For single values:
   {"value": 2200}
   
   // For values with units:
   {"value": 90, "unit": "seconds"}
   
   // For multiple allowed values:
   {"values": ["1:1", "4:5", "16:9"]}
   ```

3. **Adding New Rules**
   - New rules must be added via SQL migration
   - Use the existing structure as a template
   - Always include description and set is_customizable flag

## Example Platform Rules

### Instagram
- **Caption Length**: Max 2,200 characters
- **Hashtags**: Max 30 per post
- **Image Aspect Ratios**: 1:1 (square), 4:5 (portrait), 1.91:1 (landscape)
- **Video Length**: Max 90 seconds for feed, Reels
- **Daily Post Limit**: Recommended max 50 posts/day

### TikTok
- **Caption Length**: Max 2,200 characters
- **Hashtags**: Max 20 per video
- **Video Aspect Ratio**: 9:16 (vertical) required
- **Video Length**: 3 seconds minimum, 10 minutes maximum
- **File Size**: Max 287 MB

### LinkedIn
- **Post Length**: Max 3,000 characters
- **Hashtags**: Recommended max 3 for optimal reach
- **Video Length**: Max 10 minutes
- **Daily Posts**: Recommended 5 posts/day for best engagement

## Integration Points

### Current Integrations
1. **Dashboard Navigation** - Added to System Management section
2. **Persona Filter** - Rules filtered by persona-selected platforms
3. **User Roles** - Super admin access only for management

### Future Integrations (Recommended)
1. **Content Scheduling** - Add real-time validation warnings
2. **AI Content Generation** - Validate generated content before saving
3. **Bulk Upload** - Validate multiple posts at once
4. **Analytics** - Track rule violation patterns

## Customization

### Updating Platform Rules

When platforms update their specifications:

1. Log in as super admin
2. Navigate to System Management > Platform Rules
3. Find the rule to update
4. Click Edit and modify the JSON value
5. Update the description if needed
6. Save changes

### Adding New Platforms

To add a new social media platform:

1. Create a new SQL migration
2. Insert rules following this pattern:
```sql
INSERT INTO public.platform_rules 
(platform, rule_type, rule_name, rule_value, description) 
VALUES
('newplatform', 'text', 'caption_max_length', '{"value": 1000}', 'Description'),
('newplatform', 'media', 'image_aspect_ratios', '{"values": ["1:1", "16:9"]}', 'Description');
```
3. Add platform to TypeScript types if needed
4. Update platform icons/colors in constants

## Design System

The UI follows Fabel's design system:
- **Accent Color**: rgb(227, 195, 138) - Warm gold
- **Background**: White (#FFFFFF)
- **Typography**: Clean, modern sans-serif
- **Components**: Cards with platform-specific color accents
- **Interaction**: Smooth transitions, hover states
- **Mobile**: Fully responsive grid layouts

## Security

- **RLS Policies**: Enforced at database level
- **Super Admin Only**: Management restricted to super_admin role
- **Read Access**: All authenticated users can view active rules
- **Audit Trail**: Created/updated timestamps tracked

## Performance

- Rules cached on frontend after initial load
- Efficient JSONB queries for rule values
- Indexed by platform and rule_type for fast filtering
- Minimal database calls with batch loading

## Maintenance

### Regular Tasks
1. **Quarterly Review**: Check for platform specification updates
2. **Rule Audits**: Ensure all active rules are current
3. **User Feedback**: Monitor violation patterns to improve rules

### Monitoring
- Track rule edit frequency
- Monitor validation failure rates
- Review user feedback on warnings

## Support

For questions or issues:
1. Check this documentation first
2. Review platform official documentation
3. Contact development team for custom requirements

## Version History

- **v1.0** (2025-10-15): Initial release
  - Complete CRUD for platform rules
  - Validation utilities
  - Super admin management interface
  - Persona integration
  - 6 major platforms supported
