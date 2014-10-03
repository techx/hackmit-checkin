#!/usr/bin/env python

import sys, json, csv

OUTPUT_FILE = 'data.js'

def csv2json(data):
    lines = list(csv.reader(data))[1:]
    ret = []
    for elems in lines:
        company = elems[0]
        people = zip(elems[1::2], elems[2::2])
        for person in people:
            print person
            if person[0] != '' or person[1] != '':
                datum = {
                        'account_id': "-1",
                        'legal_waiver': person[0],
                        'school': company,
                        'badge_name': person[0],
                        'email_address': person[1],
                        'phone_number': '',
                        'dietary_restriction': '0'
                }
                ret.append(datum)
    return json.dumps(ret, indent = 2, sort_keys = True)

def main():
    if len(sys.argv) not in (2, 3):
        print('Usage: %s [input file] [output file]' % sys.argv[0])
        exit(1)
    fin = sys.argv[1]
    fout = sys.argv[2] if len(sys.argv) == 3 else OUTPUT_FILE
    with open(fin) as csv:
        with open(fout, 'w') as out:
            json = csv2json(csv)
            out.write('var personData = %s;\n' % json)

if __name__ == '__main__':
    main()
