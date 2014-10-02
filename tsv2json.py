#!/usr/bin/env python

import sys, json

OUTPUT_FILE = 'data.json'

def tsv2json(data):
    lines = data.strip().split('\n')[1:]
    ret = []
    for line in lines:
        elems = line.split('\t')
        datum = {
                'account_id': elems[0],
                'legal_waiver': elems[1],
                'school': elems[2],
                'badge_name': elems[3],
                'dietary_restriction': elems[4]
        }
        ret.append(datum)
    return json.dumps(ret, indent = 2, sort_keys = True)

def main():
    if len(sys.argv) not in (2, 3):
        print('Usage: %s [input file] [output file]' % sys.argv[0])
        exit(1)
    fin = sys.argv[1]
    fout = sys.argv[2] if len(sys.argv) == 3 else OUTPUT_FILE
    with open(fin) as tsv:
        with open(fout, 'w') as out:
            json = tsv2json(tsv.read())
            out.write('%s\n' % json)

if __name__ == '__main__':
    main()
