// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ZK-SNARK Verifier for Academic Voting
 * @dev This contract verifies zero-knowledge proofs for voter eligibility and vote integrity
 */
contract Verifier {
    using Pairing for *;
    
    struct VerifyingKey {
        Pairing.G1Point alpha;
        Pairing.G2Point beta;
        Pairing.G2Point gamma;
        Pairing.G2Point delta;
        Pairing.G1Point[] gamma_abc;
    }
    
    struct Proof {
        Pairing.G1Point a;
        Pairing.G2Point b;
        Pairing.G1Point c;
    }
    
    VerifyingKey verifyingKey;
    
    event ProofVerified(bool result);
    
    constructor() {
        verifyingKey.alpha = Pairing.G1Point(
            0x209dd15ebff5d46c4bd888e51a93cf99a7329636c63514396b4a452003a35bf7,
            0x04bf11ca01483bfa8b34b43561848d28905960114c8ac04049af4b6315a41678
        );
        verifyingKey.beta = Pairing.G2Point(
            [0x2725019753478801796453339367788033689375851816420509565303521482350756874229,
             0x0689ba8bd16b111cfae382e83ead0a0ae6d6c9a01f5a3a5c00e5e01e7c97e0e5],
            [0x113e02b4b16477c0ad02a2b7f9d1b0e7e7fdb7b1c7a2b5e8e2c2e7e7f2e9e2e2,
             0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2]
        );
        verifyingKey.gamma = Pairing.G2Point(
            [0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2,
             0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed],
            [0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b,
             0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa]
        );
        verifyingKey.delta = Pairing.G2Point(
            [0x2725019753478801796453339367788033689375851816420509565303521482350756874229,
             0x0689ba8bd16b111cfae382e83ead0a0ae6d6c9a01f5a3a5c00e5e01e7c97e0e5],
            [0x113e02b4b16477c0ad02a2b7f9d1b0e7e7fdb7b1c7a2b5e8e2c2e7e7f2e9e2e2,
             0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2]
        );
        verifyingKey.gamma_abc = new Pairing.G1Point[](3);
        verifyingKey.gamma_abc[0] = Pairing.G1Point(
            0x301a0bd537fe6cd5ba6c7b3d7b9e6a26c6d0e3b52c7cdd7a6e5a0c7b9d3f8e4b,
            0x2c5fe7b32c15b0e7b8c4b9c1e9b7a7e8b8b5e7e9e8e5e5e9b7a7e8b8b5e7e9
        );
        verifyingKey.gamma_abc[1] = Pairing.G1Point(
            0x1e5fe7b32c15b0e7b8c4b9c1e9b7a7e8b8b5e7e9e8e5e5e9b7a7e8b8b5e7e9,
            0x1c5fe7b32c15b0e7b8c4b9c1e9b7a7e8b8b5e7e9e8e5e5e9b7a7e8b8b5e7e9
        );
        verifyingKey.gamma_abc[2] = Pairing.G1Point(
            0x0e5fe7b32c15b0e7b8c4b9c1e9b7a7e8b8b5e7e9e8e5e5e9b7a7e8b8b5e7e9,
            0x2e5fe7b32c15b0e7b8c4b9c1e9b7a7e8b8b5e7e9e8e5e5e9b7a7e8b8b5e7e9
        );
    }
    
    /**
     * @dev Verify a zero-knowledge proof
     * @param _pA Proof point A
     * @param _pB Proof point B  
     * @param _pC Proof point C
     * @param publicSignals Public signals for the proof
     * @return bool Whether the proof is valid
     */
    function verifyTx(
        uint[2] memory _pA,
        uint[2][2] memory _pB,
        uint[2] memory _pC,
        uint[] memory publicSignals
    ) public returns (bool) {
        Proof memory proof;
        proof.a = Pairing.G1Point(_pA[0], _pA[1]);
        proof.b = Pairing.G2Point([_pB[0][0], _pB[0][1]], [_pB[1][0], _pB[1][1]]);
        proof.c = Pairing.G1Point(_pC[0], _pC[1]);
        
        uint[] memory inputValues = new uint[](publicSignals.length);
        for(uint i = 0; i < publicSignals.length; i++){
            inputValues[i] = publicSignals[i];
        }
        
        bool result = verifyProof(proof, inputValues);
        emit ProofVerified(result);
        return result;
    }
    
    /**
     * @dev Internal function to verify the proof using pairing operations
     */
    function verifyProof(Proof memory proof, uint[] memory input) internal view returns (bool) {
        uint256 snark_scalar_field = 21888242871839275222246405745257275088548364400416034343698204186575808495617;
        VerifyingKey memory vk = verifyingKey;
        require(input.length + 1 == vk.gamma_abc.length);
        
        // Compute the linear combination vk_x
        Pairing.G1Point memory vk_x = Pairing.G1Point(0, 0);
        for (uint i = 0; i < input.length; i++) {
            require(input[i] < snark_scalar_field);
            vk_x = Pairing.addition(vk_x, Pairing.scalar_mul(vk.gamma_abc[i + 1], input[i]));
        }
        vk_x = Pairing.addition(vk_x, vk.gamma_abc[0]);
        
        return Pairing.pairing(
            Pairing.negate(proof.a),
            proof.b,
            vk.alpha,
            vk.beta,
            vk_x,
            vk.gamma,
            proof.c,
            vk.delta
        );
    }
}

/**
 * @title Pairing library for elliptic curve operations
 * @dev Library for bn254/bn128 pairing operations required for zk-SNARK verification
 */
library Pairing {
    struct G1Point {
        uint X;
        uint Y;
    }
    
    struct G2Point {
        uint[2] X;
        uint[2] Y;
    }
    
    /// @return the generator of G1
    function P1() pure internal returns (G1Point memory) {
        return G1Point(1, 2);
    }
    
    /// @return the generator of G2
    function P2() pure internal returns (G2Point memory) {
        return G2Point(
            [10857046999023057135944570762232829481370756359578518086990519993285655852781,
             11559732032986387107991004021392285783925812861821192530917403151452391805634],
            [8495653923123431417604973247489272438418190587263600148770280649306958101930,
             4082367875863433681332203403145435568316851327593401208105741076214120093531]
        );
    }
    
    /// @return the negation of p, i.e. p.addition(p.negate()) should be zero.
    function negate(G1Point memory p) pure internal returns (G1Point memory) {
        // The prime q in the base field F_q for G1
        uint q = 21888242871839275222246405745257275088696311157297823662689037894645226208583;
        if (p.X == 0 && p.Y == 0)
            return G1Point(0, 0);
        return G1Point(p.X, q - (p.Y % q));
    }
    
    /// @return r the sum of two points of G1
    function addition(G1Point memory p1, G1Point memory p2) internal view returns (G1Point memory r) {
        uint[4] memory input;
        input[0] = p1.X;
        input[1] = p1.Y;
        input[2] = p2.X;
        input[3] = p2.Y;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 6, input, 0xc0, r, 0x60)
        }
        require(success);
    }
    
    /// @return r the product of a point on G1 and a scalar, i.e.
    /// p == p.scalar_mul(1) and p.addition(p) == p.scalar_mul(2) for all points p.
    function scalar_mul(G1Point memory p, uint s) internal view returns (G1Point memory r) {
        uint[3] memory input;
        input[0] = p.X;
        input[1] = p.Y;
        input[2] = s;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 7, input, 0x80, r, 0x60)
        }
        require(success);
    }
    
    /// @return the result of computing the pairing check
    function pairing(G1Point memory a1, G2Point memory a2, G1Point memory b1, G2Point memory b2, G1Point memory c1, G2Point memory c2, G1Point memory d1, G2Point memory d2) internal view returns (bool) {
        G1Point[4] memory p1 = [a1, b1, c1, d1];
        G2Point[4] memory p2 = [a2, b2, c2, d2];
        uint inputSize = 24;
        uint[] memory input = new uint[](inputSize);
        for (uint i = 0; i < 4; i++) {
            input[i * 6 + 0] = p1[i].X;
            input[i * 6 + 1] = p1[i].Y;
            input[i * 6 + 2] = p2[i].X[0];
            input[i * 6 + 3] = p2[i].X[1];
            input[i * 6 + 4] = p2[i].Y[0];
            input[i * 6 + 5] = p2[i].Y[1];
        }
        uint[1] memory out;
        bool success;
        assembly {
            success := staticcall(sub(gas(), 2000), 8, add(input, 0x20), mul(inputSize, 0x20), out, 0x20)
        }
        require(success);
        return out[0] != 0;
    }
}