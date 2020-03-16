<?php


namespace Groundhogg\Reporting\New_Reports;
use function Groundhogg\percentage;
use Groundhogg\Plugin;

/**
 * Created by PhpStorm.
 * User: atty
 * Date: 11/27/2018
 * Time: 9:13 AM
 */
abstract class Base_Table_Report extends Base_Report
{

    protected $dataset;

    /**
     * @return bool
     */
    abstract function only_show_top_10() ;

    abstract function get_label();

    /**
     * Normalize a datum
     *
     * @param $item_key
     * @param $item_data
     * @return array
     */
    abstract protected function normalize_datum( $item_key, $item_data );

    /**
     * Format the data into a chart friendly format.
     *
     * @param $data array
     * @return array
     */
    protected function normalize_data( $data )
    {
        if ( empty( $data ) ){
            $data = [];
        }

        $dataset = [];

        foreach ( $data as $key => $datum ){
            if ( $key && $datum ){
                $dataset[] = $this->normalize_datum( $key, $datum );
            }
        }

        $dataset = array_values( $dataset );

        usort( $dataset , array( $this, 'sort' ) );

        /* Pair down the results to largest 10 */
        if ( count( $dataset ) > 10 && $this->only_show_top_10() ){

            $other_dataset = [
                'label' => __( 'Other' ),
                'data' => 0,
                'url'  => '#'
            ];

            $other = array_slice( $dataset, 10 );
            $dataset = array_slice( $dataset, 0, 10 );

            foreach ( $other as $c_data ){
                $other_dataset[ 'data' ] += $c_data[ 'data' ];
            }

            $dataset[] = $other_dataset;

        }

        usort( $dataset , array( $this, 'sort' ) );

        $this->dataset = $dataset;

        return $dataset;
    }

    /**
     * Sort stuff
     *
     * @param $a
     * @param $b
     * @return mixed
     */
    public function sort( $a, $b )
    {
        return $b[ 'data' ] - $a[ 'data' ];
    }
}