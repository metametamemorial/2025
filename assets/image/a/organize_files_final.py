import os
import shutil
import hashlib
from datetime import datetime
from collections import defaultdict
import re

# Pillowライブラリをインポートします。ステップ1でインストールが必要です。
try:
    from PIL import Image, UnidentifiedImageError
except ImportError:
    print("エラー: Pillowライブラリが見つかりません。")
    print("コマンドプロンプトで 'pip install Pillow' を実行してインストールしてください。")
    exit()

def get_image_content_hash(filepath):
    """
    Pillowを使って画像のピクセルデータのみのハッシュを計算する。
    これにより、Exifなどのメタデータを無視して「見た目」を比較できる。
    """
    try:
        with Image.open(filepath) as img:
            image_bytes = img.tobytes()
            hasher = hashlib.md5()
            hasher.update(image_bytes)
            return hasher.hexdigest()
    except UnidentifiedImageError:
        print(f"\n警告: Pillowで画像を認識できませんでした。スキップします: {os.path.basename(filepath)}")
        return None
    except Exception as e:
        print(f"\nエラー: 画像処理中にエラーが発生しました: {os.path.basename(filepath)} ({e})")
        return None

def parse_datetime_from_filename(filename):
    """ファイル名から 'YYYY-MM-DD_HHMMSS' 形式の日時を正規表現で探し、datetimeオブジェクトを返す"""
    match = re.search(r'(\d{4}-\d{2}-\d{2})_(\d{6})', filename)
    if match:
        try:
            date_str = match.group(1)
            time_str = match.group(2)
            dt_str = f"{date_str} {time_str}"
            return datetime.strptime(dt_str, '%Y-%m-%d %H%M%S')
        except ValueError:
            return None
    return None

def main():
    """メイン処理。画像内容のハッシュに基づき、重複を排除して別フォルダにコピーする"""
    source_directory = '.'
    dest_directory_name = '2025_final'

    dest_path = os.path.join(source_directory, dest_directory_name)
    if not os.path.exists(dest_path):
        print(f"コピー先フォルダを作成します: {dest_path}")
        os.makedirs(dest_path)

    image_hashes = defaultdict(list)
    non_image_files = []
    image_extensions = ('.jpg', '.jpeg')

    print("ファイルをスキャンしています (画像内容ベース)...")
    script_name = os.path.basename(__file__)
    all_files = [f for f in os.listdir(source_directory) if os.path.isfile(os.path.join(source_directory, f)) and f != script_name]

    total_files = len(all_files)
    for i, filename in enumerate(all_files):
        print(f"\r処理中: {i+1}/{total_files} ({filename})", end="", flush=True)
        filepath = os.path.join(source_directory, filename)

        if filename.lower().endswith(image_extensions):
            file_hash = get_image_content_hash(filepath)
            if file_hash:
                dt = parse_datetime_from_filename(filename)
                image_hashes[file_hash].append({'path': filepath, 'datetime': dt, 'name': filename})
        else:
            non_image_files.append(filepath)
    print("\nスキャンが完了しました。")

    final_copy_list = []
    print("\n重複をチェックし、コピーするファイルを決定します...")

    for file_hash, files in image_hashes.items():
        if len(files) == 1:
            final_copy_list.append(files[0]['path'])
            continue

        print(f"重複グループ (ハッシュ: {file_hash[:10]}...):")
        files_with_datetime = [f for f in files if f['datetime'] is not None]
        chosen_file = None
        if files_with_datetime:
            files_with_datetime.sort(key=lambda x: x['datetime'])
            chosen_file = files_with_datetime[0]
            print(f"  -> 日時で選択: {chosen_file['name']}")
        else:
            files.sort(key=lambda x: x['name'])
            chosen_file = files[0]
            print(f"  -> ファイル名で選択: {chosen_file['name']}")
        final_copy_list.append(chosen_file['path'])
        for f in files:
            if f['path'] != chosen_file['path']:
                print(f"  -> スキップ:   {f['name']}")

    final_copy_list.extend(non_image_files)
    final_copy_list = sorted(list(set(final_copy_list)))

    if not final_copy_list:
        print("\nコピー対象のファイルは見つかりませんでした。")
        return

    print(f"\n合計 {len(final_copy_list)} 個のファイルを '{dest_directory_name}' フォルダにコピーします。")

    copied_count = 0
    skipped_count = 0
    total_to_copy = len(final_copy_list)
    for i, src_path in enumerate(final_copy_list):
        filename = os.path.basename(src_path)
        dest_file_path = os.path.join(dest_path, filename)
        print(f"\rコピー中: {i+1}/{total_to_copy} ({filename})", end="", flush=True)
        try:
            if not os.path.exists(dest_file_path):
                shutil.copy2(src_path, dest_file_path)
                copied_count += 1
            else:
                skipped_count += 1
        except (IOError, shutil.Error) as e:
            print(f"\nコピーエラー: {e}")

    print(f"\n\nコピー処理が完了しました。")
    print(f"  - 新しくコピーしたファイル: {copied_count}個")
    print(f"  - スキップしたファイル (コピー先に既に存在): {skipped_count}個")

if __name__ == '__main__':
    main()