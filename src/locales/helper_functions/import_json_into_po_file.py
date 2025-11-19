import json
import re
import codecs


def extract_master_json(file_path):
  """
  Extract the master JSON from the messages.ts file.
  The file contains: export const messages=JSON.parse("...")

  Args:
      file_path: Path to the messages.ts file (e.g., './en/messages.ts')

  Returns:
      dict: Parsed JSON object with message IDs and English texts
  """
  try:
    with open(file_path, 'r', encoding='utf-8') as f:
      content = f.read()

    # Find the JSON string inside JSON.parse("...")
    # The pattern needs to handle the fact that the string may contain escaped quotes
    match = re.search(r'JSON\.parse\("(.+)"\)', content, re.DOTALL)

    if not match:
      raise ValueError("Could not find JSON.parse() in the file")

    json_string = match.group(1)

    # Decode unicode and escape sequences properly
    # Use codecs.decode to handle all escape sequences at once
    try:
      json_string = codecs.decode(json_string, 'unicode_escape')
    except:
      # Fallback: manual replacement
      json_string = json_string.replace(r'\"', '"')
      json_string = json_string.replace(r'\\', '\x00')  # Temp placeholder
      json_string = json_string.replace('\\', '')
      json_string = json_string.replace('\x00', '\\')

    # Parse the JSON
    master_data = json.loads(json_string)

    print(f"✓ Successfully loaded {len(master_data)} entries from master file")
    return master_data

  except FileNotFoundError:
    print(f"✗ Error: File not found: {file_path}")
    return None
  except json.JSONDecodeError as e:
    print(f"✗ Error parsing JSON: {e}")
    print(f"Problematic area: ...{json_string[max(0, e.pos - 50):e.pos + 50]}...")
    return None
  except Exception as e:
    print(f"✗ Error: {e}")
    return None


def load_german_json(file_path):
  """
  Load the German translations from german.json file.
  This is a standard JSON file with the same structure as the master.

  Args:
      file_path: Path to the german.json file (e.g., './de/german.json')

  Returns:
      dict: Parsed JSON object with message IDs and German texts
  """
  try:
    with open(file_path, 'r', encoding='utf-8') as f:
      german_data = json.load(f)

    print(f"✓ Successfully loaded {len(german_data)} entries from German file")
    return german_data

  except FileNotFoundError:
    print(f"✗ Error: File not found: {file_path}")
    return None
  except json.JSONDecodeError as e:
    print(f"✗ Error parsing JSON: {e}")
    return None
  except Exception as e:
    print(f"✗ Error: {e}")
    return None


def match_translations(master_data, german_data):
  """
  Match German translations to English master strings using cryptic keys.
  Creates a mapping of English text -> German text.

  Args:
      master_data: Dictionary from master English file {key: [english_text]}
      german_data: Dictionary from German file {key: [german_text]}

  Returns:
      dict: Mapping of {english_text: german_text}
  """
  translation_map = {}
  matched_count = 0
  unmatched_keys = []

  print("\nMatching translations...")

  for key, english_value in master_data.items():
    # Get the English text (first element of the array)
    english_text = english_value[0] if isinstance(english_value, list) else english_value

    # Check if this key exists in German data
    if key in german_data:
      german_value = german_data[key]
      german_text = german_value[0] if isinstance(german_value, list) else german_value

      # Create the mapping
      translation_map[english_text] = german_text
      matched_count += 1
    else:
      unmatched_keys.append(key)

  print(f"✓ Matched {matched_count} translations")

  if unmatched_keys:
    print(f"⚠ Warning: {len(unmatched_keys)} keys from master not found in German file")
    print(f"  First few unmatched keys: {unmatched_keys[:5]}")

  return translation_map


def update_po_file(po_file_path, translation_map, output_path=None):
  """
  Read a .po file and update empty msgstr entries with German translations.
  Preserves the original file structure as much as possible.

  Args:
      po_file_path: Path to the messages.po file (e.g., './de/messages.po')
      translation_map: Dictionary mapping English text to German text
      output_path: Optional path for output file. If None, overwrites input file.

  Returns:
      tuple: (updated_count, total_empty_count)
  """
  try:
    with open(po_file_path, 'r', encoding='utf-8') as f:
      lines = f.readlines()

    print(f"\nProcessing .po file: {po_file_path}")

    updated_lines = []
    updated_count = 0
    total_empty_count = 0
    current_msgid = None
    current_msgid_lines = []
    in_msgid = False

    i = 0
    while i < len(lines):
      line = lines[i]

      # Detect msgid start
      if line.startswith('msgid '):
        in_msgid = True
        current_msgid_lines = [line]
        updated_lines.append(line)
        i += 1
        continue

      # Continue collecting msgid if it's a multiline string
      if in_msgid and line.startswith('"') and not line.startswith('msgstr'):
        current_msgid_lines.append(line)
        updated_lines.append(line)
        i += 1
        continue

      # Detect msgstr start
      if line.startswith('msgstr '):
        in_msgid = False

        # Parse the complete msgid
        current_msgid = parse_po_string(current_msgid_lines)

        # Check if msgstr is empty (msgstr "")
        msgstr_content = line.split('msgstr ', 1)[1].strip()
        is_empty = msgstr_content == '""'

        if is_empty:
          total_empty_count += 1

          # Try to find translation
          if current_msgid in translation_map:
            german_text = translation_map[current_msgid]

            # Check if the German text contains newlines (multiline)
            if '\n' in german_text:
              # Multiline format
              updated_lines.append('msgstr ""\n')
              # Split by newlines and format each part
              parts = german_text.split('\n')
              for part in parts:
                escaped_part = part.replace('\\', '\\\\').replace('"', '\\"')
                updated_lines.append(f'"{escaped_part}\\n"\n')
            else:
              # Single line format
              escaped_text = german_text.replace('\\', '\\\\').replace('"', '\\"')
              updated_lines.append(f'msgstr "{escaped_text}"\n')

            updated_count += 1
            i += 1
            continue

        # If not updated or not empty, keep original line
        updated_lines.append(line)
        i += 1
        continue

      # Regular line (comments, empty lines, continuation lines, etc.)
      updated_lines.append(line)
      i += 1

    # Write to output file
    output = output_path or po_file_path
    with open(output, 'w', encoding='utf-8') as f:
      f.writelines(updated_lines)

    print(f"✓ Updated {updated_count} out of {total_empty_count} empty translations")
    print(f"✓ Output written to: {output}")

    return updated_count, total_empty_count

  except FileNotFoundError:
    print(f"✗ Error: File not found: {po_file_path}")
    return 0, 0
  except Exception as e:
    print(f"✗ Error: {e}")
    import traceback
    traceback.print_exc()
    return 0, 0


def parse_po_string(lines):
  """
  Parse a msgid or msgstr from PO file lines.
  Handles multiline strings.

  Args:
      lines: List of lines containing the string (including msgid/msgstr keyword)

  Returns:
      str: The parsed string content
  """
  result = []

  for line in lines:
    # Remove msgid/msgstr keyword from first line
    if line.startswith('msgid ') or line.startswith('msgstr '):
      line = line.split(' ', 1)[1]

    # Extract content between quotes
    line = line.strip()
    if line.startswith('"') and line.endswith('"'):
      content = line[1:-1]
      # Unescape - handle \n as actual newlines
      content = content.replace('\\n', '\n')
      content = content.replace('\\"', '"')
      content = content.replace('\\\\', '\\')
      result.append(content)

  return ''.join(result)


# Test the function
if __name__ == "__main__":
  master_file = '../en/messages.ts'
  master_data = extract_master_json(master_file)

  if master_data:
    # Print a sample of the data
    print("\nSample entries from master file:")
    for i, (key, value) in enumerate(list(master_data.items())[:3]):
      print(f"  {key}: {value}")
      if i >= 2:
        break

  print("\n" + "=" * 50 + "\n")

  german_file = './german.json'
  german_data = load_german_json(german_file)

  if german_data:
    # Print a sample of the data
    print("\nSample entries from German file:")
    for i, (key, value) in enumerate(list(german_data.items())[:3]):
      print(f"  {key}: {value}")
      if i >= 2:
        break

  print("\n" + "=" * 50 + "\n")

  if master_data and german_data:
    translation_map = match_translations(master_data, german_data)

    # Print a sample of matched translations
    print("\nSample matched translations:")
    for i, (eng, ger) in enumerate(list(translation_map.items())[:3]):
      print(f"  EN: {eng[:50]}...")
      print(f"  DE: {ger[:50]}...")
      print()
      if i >= 2:
        break

    print("\n" + "=" * 50 + "\n")

    # Update the PO file
    po_file = '../de/messages.po'
    output_file = '../de/messages_updated.po'  # Optional: specify output file
    update_po_file(po_file, translation_map, output_file)