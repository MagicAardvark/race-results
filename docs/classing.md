# Classing Data Structure

Overview of the tables and views related to classing.

# Tables

## Class Types

- SQL: `classes_types`
- Code: `@db/classTypes`
- An overarching global class type, i.e. "SCCA National Solo" classes.

## Class Categories

- SQL: 'classes_categories`
- Code: `@db/classCategories`
- A logical grouping of class/prep level.

## Base Classes

- SQL: `classes_base`
- Code: `@db/baseClasses`
- Lowest class element, everything else is built from here
- Can be global, or org specific. `orgId = null` will mean that it is available globally.

### Class Index Values

- SQL: `classes_index_values`
- Code: `@db/classIndexValues`
- Effective dated index values for each base class
- Can be overriden by at the org level

## Class Groups

- SQL: `classes_groups`
- Code: `@db/classGroups`
- Grouping of base classes into competitive groupings, i.e. "S1", "Pro", "Novice"
- Exist only at the org level

### Class Group Classes

- SQL: `classes_group_classes`
- Code: `@db/classGroupClasses`
- The base classes that are part of the group

# Views

## Effective Base Class Index Values

- SQL: `classes_effective_index_values_vw`
- Code: `@db/effectiveBaseClassIndexValues`
- A list of all base classes and index values, with the effective date range

## Class Group Classes

- SQL: `classes_flattened_group_classes_vw`
- Code: `@db/flattenedClassGroupClasses`
- A list of all classes with the class group and org they belong to

## Effective Class Group Class Index Values

- SQL: `classes_group_effective_index_values_vw`
- Code: `@db/effectiveClassGroupIndexValues`
- Class group classes, groups, and with index values, with the effective date range

## Classes With Effective Index Values

- SQL: `classes_with_effective_index_values_vw`
- Code: `@db/classesWithEffectiveIndexValues`
- Merged classes and class group classes with their index values, with the effective date range
- This view should power all result building as it will provide the classing information in the format the event provides it, i.e. "PGS".
