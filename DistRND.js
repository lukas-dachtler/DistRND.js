/*!
  * DistRND.js v1.0
  * Copyright (c) 2019 Lukas Dachtler
  * Licensed under MIT (https://github.com/lukas-dachtler/DistRND.js/blob/master/LICENSE.md)
  */
function DistRND(min, max, spread = 0) {
    let _negDeviation = new DistRND_DataStructure();
    let _posDeviation = new DistRND_DataStructure();
    let _range = max - min + 1;
    let _cnt, _avg;
    _init();

    /***
     * Initializes the randomizer
     */
    function _init() {
        for (let i = min; i <= max; i++) {
            _negDeviation.add(i, 0);
        }
        _cnt = 0;
        _avg = 0;
    }

    /***
     * Generates the next random number
     * @returns {number}
     */
    this.next = function () {
        _cnt++;
        const entry = _negDeviation.getRandom();
        _negDeviation.increase(entry.value);
        if (entry.count + 1 > _avg + spread) {
            _moveToPositive(entry.value, entry.count + 1);
        }
        const calc = Math.floor(_cnt / _range);
        if (calc > _avg) {
            _avg = calc;
            splitDeviations();
        }
        return entry.value;
    };

    /***
     * Splits all entries into -Deviation and +Deviation
     */
    function splitDeviations() {
        for (let i = min; i <= max; i++) {
            if (spread === 0) {
                const count = _posDeviation.getCount(i);
                _moveToNegative(i, count);
            } else {
                const count = _negDeviation.getCount(i);
                if (count != null) {
                    if (count > _avg + spread) {
                        _moveToPositive(i, count);
                    }
                } else {
                    const count = _posDeviation.getCount(i);
                    if (count <= _avg + spread) {
                        _moveToNegative(i, count);
                    }
                }
            }
        }
    }

    /***
     * Moves entry from -Deviation to +Deviation
     * @param value
     * @param count
     */
    function _moveToPositive(value, count) {
        _negDeviation.remove(value);
        _posDeviation.add(value, count);
    }

    /***
     * Moves entry from +Deviation to -Deviation
     * @param value
     * @param count
     */
    function _moveToNegative(value, count) {
        _posDeviation.remove(value);
        _negDeviation.add(value, count);
    }

    /***
     * Resets randomizer
     */
    this.reset = function () {
        _negDeviation.clear();
        _posDeviation.clear();
        _init();
    };
}

function DistRND_DataStructure() {
    let ArrayList = [];
    let HashMap = {};

    /***
     * Adds entry
     * @param value
     * @param count
     */
    this.add = function (value, count) {
        ArrayList.push(value);
        HashMap[value] = {index: ArrayList.length - 1, count: count};
    };

    /***
     * Removes entry
     * @param value
     */
    this.remove = function (value) {
        const entry = HashMap[value];
        if (entry !== undefined) {
            HashMap[value] = undefined;
            const size = ArrayList.length - 1;
            if (entry.index !== size) {
                ArrayList[entry.index] = ArrayList[size];
                ArrayList.pop();
                HashMap[ArrayList[entry.index]].index = entry.index;
            } else {
                ArrayList.pop();
            }
        }
    };

    /***
     * Increases count of entry
     * @param value
     */
    this.increase = function (value) {
        HashMap[value].count++;
    };

    /**
     * Returns count of entry
     * @param value
     * @returns {number|null}
     */
    this.getCount = function (value) {
        const entry = HashMap[value];
        if (entry !== undefined) {
            return HashMap[value].count;
        } else {
            return null;
        }
    };

    /***
     * Returns a random entry
     * @returns {object}
     */
    this.getRandom = function () {
        const value = ArrayList[Math.floor(Math.random() * ArrayList.length)];
        return {
            value: value,
            count: HashMap[value].count
        }
    };

    /***
     * Clears all entries
     */
    this.clear = function () {
        ArrayList = [];
        HashMap = {};
    };
}