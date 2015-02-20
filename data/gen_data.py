#!/usr/bin/env python

import sys, json, csv

OUTPUT_FILE = 'data.js'

def tsv2json(data, retlist):
    lines = data.strip().split('\n')[1:]
    for line in lines:
        elems = line.split('\t')
        datum = {
                'account_id': elems[0],
                'legal_waiver': elems[1],
                'organization': elems[2],
                'badge_name': elems[3],
                'email_address': elems[4],
                'phone_number': elems[5],
                'dietary_restriction': elems[6],
                'sponsor': '0'
        }
        retlist.append(datum)

def csv2json(data, retlist):
    lines = list(csv.reader(data))[1:]
    for elems in lines:
        company = elems[0]
        people = zip(elems[1::2], elems[2::2])
        for person in people:
            if person[0] != '' or person[1] != '':
                datum = {
                        'account_id': "-1",
                        'legal_waiver': person[0],
                        'organization': company,
                        'badge_name': person[0],
                        'email_address': person[1],
                        'phone_number': '',
                        'dietary_restriction': '0',
                        'sponsor': '1'
                }
                retlist.append(datum)

def main():
    if len(sys.argv) not in (3, 4):
        print('Usage: %s [participaint data file] [sponsor data file] {output file}' % sys.argv[0])
        exit(1)
    pin = sys.argv[1]
    sin = sys.argv[2]
    fout = sys.argv[3] if len(sys.argv) == 4 else OUTPUT_FILE
    ret = []
    with open(pin) as tsv:
        tsv2json(tsv.read(), ret)
    with open(sin) as csv:
        csv2json(csv, ret)
    with open(fout, 'w') as out:
        data = json.dumps(ret, indent = 2, sort_keys = True)
        out.write('var personData = %s;\n' % data)

if __name__ == '__main__':
    main()
